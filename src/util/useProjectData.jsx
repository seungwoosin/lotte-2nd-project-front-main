import { useCallback, useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import axiosInstance from '@/services/axios.jsx';


const useProjectData  = (projectId) => {
    const [project, setProject] = useState({
        id: 1,
        title: "",
        type: "",
        status: "",
        columns:[],
        coworkers:[]
    });
    const [isConnected, setIsConnected] = useState(false); // WebSocket 연결 상태
    const [stompClient, setStompClient] = useState(null); // STOMP 클라이언트 인스턴스

    // HTTP GET으로 초기 데이터 가져오기
    useEffect(() => {
        const fetchBoardData = async () => {
            try {
                const response = await axiosInstance.get(`/api/project/${projectId}`);
                setProject(response.data); // 받은 데이터로 boardData 설정
            } catch (error) {
                console.error('Error fetching board data:', error);
            }
        };
        fetchBoardData();
    }, [projectId]);


    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const wsUrl = "ws://" + apiBaseUrl.replace("http://", "") + "/ws-project";

    // WebSocket 연결 헤더 가져오기
    const getWebSocketHeaders = async () => {
        const accessToken = await axiosInstance.defaults.headers.Authorization;
        return {
            Authorization: accessToken || '',
        };
    };

    // STOMP 클라이언트 초기화
    useEffect(() => {
        const initializeStompClient = async () => {
            const headers = await getWebSocketHeaders();

            const client = new Client({
                brokerURL: wsUrl,
                connectHeaders: headers,
                debug: (str) => console.log("Project Debug Log:", str),
                reconnectDelay: 5000, // 5초마다 재연결 시도
                onConnect: () => {
                    console.log('Project connected');
                    setIsConnected(true);

                    client.subscribe(`/topic/project/${projectId}/update`, (message) => {
                        const eventData = JSON.parse(message.body);
                        handleBoardEvent(eventData); // 메시지 처리
                    });
                },
                onStompError: (frame) => {
                    console.error('Project STOMP Error:', frame.headers['message']);
                },
            });

            setStompClient(client);
            client.activate();
        };

        initializeStompClient();

        return () => {
            if (stompClient) {
                stompClient.deactivate();
            }
        };
    }, [projectId]);

    const sendWebSocketMessage = useCallback((message, destination) => {
        if (isConnected && stompClient) {
            stompClient.publish({
                destination: destination, // 동적으로 변경되는 목적지
                body: JSON.stringify(message), // 전송할 메시지
            });
        } else {
            console.error('Project is not connected');
        }
    }, [isConnected, stompClient]);  // stompClient와 isConnected만 의존성 배열에 포함


    const handleBoardEvent = (eventData) => {
        if (!eventData || !eventData.type || !eventData.payload) {
            console.warn('Invalid event data received:', eventData);
            return;
        }
    
        const { type, payload } = eventData;
    
        switch (type) {
            case 'TASK_ADDED':
                setProject(prevProject => ({
                    ...prevProject,
                    columns: prevProject.columns.map(column => 
                        column.id === payload.ColumnId
                            ? { ...column, tasks: [...column.tasks, payload] }
                            : column
                    )
                }));
                break;
    
            case 'TASK_UPDATED':
                setProject(prevProject => ({
                    ...prevProject,
                    columns: prevProject.columns.map(column => ({
                        ...column,
                        tasks: column.tasks.map(task => 
                            task.id === payload.id ? payload : task
                        )
                    }))
                }));
                break;
    
            case 'TASK_DELETED':
                setProject(prevProject => ({
                    ...prevProject,
                    columns: prevProject.columns.map(column => ({
                        ...column,
                        tasks: column.tasks.filter(task => task.id !== payload.id)
                    }))
                }));
                break;
    
            case 'COLUMN_ADDED':
                setProject(prevProject => ({
                    ...prevProject,
                    columns: [...prevProject.columns, { ...payload, tasks: [] }]
                }));
                break;
    
            case 'COLUMN_UPDATED':
                setProject(prevProject => ({
                    ...prevProject,
                    columns: prevProject.columns.map(column => 
                        column.id === payload.id ? { ...column, ...payload } : column
                    )
                }));
                break;
    
            case 'COLUMN_DELETED':
                setProject(prevProject => ({
                    ...prevProject,
                    columns: prevProject.columns.filter(column => column.id !== payload.id)
                }));
                break;
    
            case 'SUBTASK_ADDED':
                setProject(prevProject => ({
                    ...prevProject,
                    columns: prevProject.columns.map(column => ({
                        ...column,
                        tasks: column.tasks.map(task => 
                            task.id === payload.taskId
                                ? { ...task, subTasks: [...task.subTasks, payload] }
                                : task
                        )
                    }))
                }));
                break;
    
            case 'SUBTASK_UPDATED':
                console.log("payload : ",payload)
                setProject(prevProject => ({
                    ...prevProject,
                    columns: prevProject.columns.map(column => ({
                        ...column,
                        tasks: column.tasks.map(task => ({
                            ...task,
                            subTasks: task.subTasks.map(subtask => {
                                console.log("subtask : ",subtask)
                                return subtask.id === payload.id ? payload : subtask
                                }
                            )
                        }))
                    }))
                }));
                break;
    
            case 'SUBTASK_DELETED':
                setProject(prevProject => ({
                    ...prevProject,
                    columns: prevProject.columns.map(column => ({
                        ...column,
                        tasks: column.tasks.map(task => ({
                            ...task,
                            subTasks: task.subTasks.filter(subtask => subtask.id !== payload.id)
                        }))
                    }))
                }));
                break;
    
            case 'COMMENT_ADDED':
                setProject(prevProject => ({
                    ...prevProject,
                    columns: prevProject.columns.map(column => ({
                        ...column,
                        tasks: column.tasks.map(task => 
                            task.id === payload.taskId
                                ? { ...task, comments: [...task.comments, payload] }
                                : task
                        )
                    }))
                }));
                break;
    
            case 'COMMENT_UPDATED':
                setProject(prevProject => ({
                    ...prevProject,
                    columns: prevProject.columns.map(column => ({
                        ...column,
                        tasks: column.tasks.map(task => ({
                            ...task,
                            comments: task.comments.map(comment => 
                                comment.id === payload.id ? payload : comment
                            )
                        }))
                    }))
                }));
                break;
    
            case 'COMMENT_DELETED':
                setProject(prevProject => ({
                    ...prevProject,
                    columns: prevProject.columns.map(column => ({
                        ...column,
                        tasks: column.tasks.map(task => ({
                            ...task,
                            comments: task.comments.filter(comment => comment.id !== payload.id)
                        }))
                    }))
                }));
                break;
    
            default:
                console.warn(`Unhandled event type: ${type}`);
        }
    };
    

    return {
        project,
        sendWebSocketMessage
    };
};

export default useProjectData ;