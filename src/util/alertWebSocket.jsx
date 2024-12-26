import { useEffect, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import axiosInstance from '@/services/axios.jsx';

const alertWebSocket = ({ initialDestination, initialMessage, initialCalendarId, initialUserId }) => {
    const [destination, setDestination] = useState(initialDestination);
    const [sendMessage, setSendMessage] = useState(initialMessage);
    const [isConnected, setIsConnected] = useState(false);
    const [receiveMessage, setReceiveMessage] = useState([]);
    const [userId, setUserId] = useState(initialUserId);
    const [subscriptions, setSubscriptions] = useState([]);

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const wsUrl = "ws://" + apiBaseUrl.replace("http://", "") + "/ws-alert";

    const [stompClient, setStompClient] = useState(null);

    const getWebSocketHeaders = async () => {
        const accessToken = await axiosInstance.defaults.headers.Authorization;
        return {
            Authorization: accessToken || '',
        };
    };

    const initializeStompClient = useCallback(async () => {
        const headers = await getWebSocketHeaders();
        const client = new Client({
            brokerURL: wsUrl,
            connectHeaders: headers,
            debug: function (str) {
            },
            onConnect: () => {
                setIsConnected(true);
                updateSubscriptions(client);
            },
            onStompError: (frame) => {
                console.log("STOMP Error:", frame);
            },
        });
        setStompClient(client);
    }, [wsUrl]);


    const updateSubscriptions = (client) => {
        if (userId) {
            client.unsubscribe("/topic/alert")
            client.subscribe(`/topic/alert`, (message) => {
                try {
                    const response = JSON.parse(message.body);
                    const filteredResponses = response.filter(item => {
                        // userIds 배열이 존재하고, userId가 포함되어 있는지 확인
                        const userIdsArray = item.userIds;
                        return userIdsArray && userIdsArray.includes(userId.toString());
                    });
                    
                    // 결과 출력

                    setReceiveMessage(filteredResponses);
                } catch (error) {
                    console.error("Failed to parse user message:", error);
                }
            });
            
        }
        if (destination && sendMessage) {
            client.publish({
                destination,
                body: sendMessage,
            });
        }
    };
    // 새 구독 추가 함수
    const addSubscription = (path, callback) => {
        if (stompClient && isConnected) {
            // Declare the subscription variable
            const subscription = stompClient.subscribe(path, (message) => {
                try {
                    const response = JSON.parse(message.body);
                    callback(response); // Execute the provided callback with the parsed response
                } catch (error) {
                    console.error(`Failed to parse message for ${path}:`, error);
                }
            });
    
            // Add the subscription to the state
            setSubscriptions((prev) => [...prev, { path, subscription }]);
        } else {
            console.error("WebSocket is not connected. Unable to add subscription.");
        }
    };
    const removeSubscription = (path) => {
        const subscription = subscriptions.find((sub) => sub.path === path);
        if (subscription) {
            subscription.subscription.unsubscribe();
            setSubscriptions((prev) => prev.filter((sub) => sub.path !== path));
        }
    };


    useEffect(() => {
        if (!stompClient) {
            initializeStompClient();
        } else {
            stompClient.activate();
        }

        return () => {
            if (stompClient) {
                stompClient.deactivate();
            }
        };
    }, [stompClient, initializeStompClient]);

    useEffect(() => {
        if (stompClient && isConnected) {
            updateSubscriptions(stompClient);
            addSubscription(`/user/${userId}/topic/alerts`, (message) => {
                console.log("User Notifications:", message.body);
                // 사용자 알림 처리 로직
            });
    
            return () => {
                removeSubscription(`/topic/updates`);
            };
        }
    }, [userId, isConnected, stompClient]);

  

    const sendWebSocketMessage = useCallback((message, path) => {
        if (isConnected && stompClient) {
            stompClient.publish({
                destination: path,
                body: JSON.stringify(message),
            });
        } else {
            console.error('WebSocket is not connected');
        }
    }, [stompClient, isConnected]);

    const updateUserId = (newId) => {
        setUserId(newId);
    };

    return {
        stompClient,
        setDestination,
        setSendMessage,
        isConnected,
        receiveMessage,
        sendWebSocketMessage,
        updateUserId,
        initializeStompClient
    };
};

export default alertWebSocket;
