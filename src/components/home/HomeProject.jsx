import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import axiosInstance from '@/services/axios.jsx'
import useUserStore from "../../store/useUserStore";
import { useEffect, useMemo, useState } from "react";
import { CustomSVG } from "../project/_CustomSVG";
// import { retail_v2 } from "googleapis";


const HomeProject = () => {
    const user = useUserStore((state)=> state.user);

    const [progressMap, setProgressMap] = useState({}); // 프로젝트별 진행률을 관리
    const [progressColor, setProgressColor] = useState('indigo');

    const [visibleColumnsMap, setVisibleColumnsMap] = useState({"no_project_1": { "no_column_1": true },});

    const toggleColumnVisibility = (projectId, columnId) => {
        setVisibleColumnsMap((prev) => ({
            ...prev,
            [projectId]: {
                ...prev[projectId],
                [columnId]: !prev[projectId]?.[columnId],
            },
        }));
    };

    const homeProjectAPI = async () => {
        const resp = await axiosInstance.get('/api/homeProject');
        console.log("홈 프로젝트 "+JSON.stringify(resp.data));
        return resp.data;
    }

    const { data, isError, isLoading }= useQuery({
                                            queryKey: [`${user.uid}`],
                                            queryFn: homeProjectAPI,
                                        })

                                        
    const getFormattedDueDate = (duedate) => {

        if (!duedate || isNaN(new Date(duedate))) {
        return null; // 기본값 출력 (필요에 따라 수정 가능)
        }
        const today = new Date();
        const dueDate = new Date(duedate);
    
        // 날짜 차이를 계산 (단위: 밀리초 → 일)
        const differenceInTime = dueDate - today;
        const differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));
    
        // D-day 출력 조건
        if (differenceInDays === 0) {
        return 'D-day';
        } else if (differenceInDays > 0) {
        return `D-${differenceInDays}`;
        } else {
        return `D+${Math.abs(differenceInDays)}`;
        }
    };

    const getDateColor = (date) => {
        if (typeof date !== "string") return "";
    
        if (date === "D-day") {
        return "text-red-600 font-semibold";
        } else if (date.includes("-")) {
        return date.length === 3
            ? "text-yellow-600 font-semibold"
            : "text-green-600 font-semibold";
        } else {
        return "";
        }
    };

    const calculateProgress = (data) => {
        const newProgressMap = {}; // 각 프로젝트의 진행률을 계산하여 저장할 객체

        // 데이터가 올바르게 로드되었는지 확인
        if (data && Array.isArray(data)) {
            data.forEach((n) => {
                let totalTasks = 0;
                let completedTasks = 0;

                if (n.getProjectColumn && Array.isArray(n.getProjectColumn)) {
                    n.getProjectColumn.forEach((column) => {
                        if (column.tasks && Array.isArray(column.tasks)) {
                            column.tasks.forEach((task) => {
                                if (task.status === 2) { // 완료된 태스크는 status 2
                                    completedTasks += 1;
                                }
                                totalTasks += 1;
                            });
                        }
                    });
                }

                // 각 프로젝트별 진행률 계산
                if (totalTasks > 0) {
                    const progressPercentage = Math.round((completedTasks / totalTasks) * 100);
                    newProgressMap[n.projectId] = progressPercentage;
                } else {
                    newProgressMap[n.projectId] = 0; // 완료된 작업이 없으면 0%로 설정
                }
            });
        }

        // 계산된 진행률을 상태에 반영
        setProgressMap(newProgressMap);
    };

    useEffect(() => {
        if (data && data.length > 0 && Array.isArray(data)) {
            const initialColumnsMap = {};
            data.forEach((project) => {
                if (!initialColumnsMap[project.projectId]) {
                    initialColumnsMap[project.projectId] = {}; // 컬럼을 객체로 초기화
                }
                // 첫 번째 컬럼만 기본적으로 보이게 설정
                const firstColumn = project.getProjectColumn[0];
                initialColumnsMap[project.projectId][firstColumn.id] = true;
    
                // 나머지 컬럼은 보이지 않도록 설정
                project.getProjectColumn.forEach((column, index) => {
                    if (index !== 0) {
                        initialColumnsMap[project.projectId][column.id] = false;
                    }
                });
            });
            setVisibleColumnsMap(initialColumnsMap);
        }
        
        calculateProgress(data);
    }, [data]);
    
    return (
        <>
            <ul className='w-full h-full flex justify-start gap-4'>
                {isLoading ? (
                    <p>로딩 중...</p>
                ) : isError ? (
                    <p>데이터를 불러오는 데 실패했습니다.</p>
                ) : (!Array.isArray(data) || data.length === 0) ? (
                        <>
                            <li className='home-project flex flex-col justify-between'>
                                <div>
                                    <Link to={"/project"}>
                                        <div className="flex justify-between">
                                            <h2 className='text-xl flex items-center'>프로젝트 만들기</h2>
                                        </div>
                                        <span className="text-sm text-gray-500">PLANTRY로 프로젝트를 관리해요</span>
                                    </Link>
                                    <div className='mt-[10px] h-[235px] overflow-scroll scrollbar-none'>
                                        <div className="">
                                            <div
                                                className="flex items-center cursor-pointer justify-between"
                                                onClick={() => toggleColumnVisibility("no_project_1", "no_column_1")} // 토글 기능 추가
                                                >
                                                <div className="flex items-center">
                                                    <div
                                                        className={`border-4 border-red-500 rounded-full w-[15px] h-[15px] mr-2`}
                                                        ></div>
                                                    <div>👀 아직 프로젝트가 없어요!</div>
                                                </div>
                                                <img
                                                    src={visibleColumnsMap["no_project_1"]?.["no_column_1"] ? "/images/arrow-top.png" : "/images/arrow-bot.png"}
                                                    alt=""
                                                    className="h-[8px] w-[13px]"
                                                />    
                                            </div>
                                            {visibleColumnsMap["no_project_1"]?.["no_column_1"] && (
                                                <Link to={"/project"}>
                                                    <div className='project-inbox flex items-center justify-between'>
                                                        <div>
                                                            <p className='project-title'>새로운 프로젝트를 만드시겠어요?</p>
                                                            <p className='project-content'>태스크를 만들고, 마감일을 설정해요</p>
                                                        </div>
                                                        <img src="/images/ArrowForward.png" alt="" className="w-[20px] h-[20px]"/>
                                                    </div>
                                                </Link>
                                            )}
                                        </div>
                                        <div className="mt-10">
                                            <div
                                                className="flex items-center cursor-pointer justify-between"
                                                onClick={() => toggleColumnVisibility("no_project_1", "no_column_0")} // 토글 기능 추가
                                                >
                                                <div className="flex items-center">
                                                    <div
                                                        className={`border-4 border-blue-500 rounded-full w-[15px] h-[15px] mr-2`}
                                                        ></div>
                                                    <div>💡 프로젝트를 어떻게 만드나요?</div>
                                                </div>
                                                <img
                                                    src={visibleColumnsMap["no_project_1"]?.["no_column_0"] ? "/images/arrow-top.png" : "/images/arrow-bot.png"}
                                                    alt=""
                                                    className="h-[8px] w-[13px]"
                                                />    
                                            </div>
                                            {visibleColumnsMap["no_project_1"]?.["no_column_0"] && (
                                            <>
                                                <div className='project-inbox'>
                                                    <p className='project-title'>칸반보드 형식의 프로젝트가 제공돼요</p>
                                                    <p className='project-content'>나만의 보드도 만들 수 있어요</p>
                                                </div>
                                                <div className='project-inbox'>
                                                    <p className='project-title'>태스크를 만들어 자유롭게 관리해요</p>
                                                    <p className='project-content'>만들고, 끌어놓고, 비워요!</p>
                                                </div>
                                            </>)}
                                        </div>
                                        <div className="mt-10">
                                            <div
                                                className="flex items-center cursor-pointer justify-between"
                                                onClick={() => toggleColumnVisibility("no_project_1", "no_column_2")} // 토글 기능 추가
                                                >
                                                <div className="flex items-center">
                                                    <div
                                                        className={`border-4 border-green-500 rounded-full w-[15px] h-[15px] mr-2`}
                                                        ></div>
                                                    <div>🙋‍♂️ 공동 작업자를 등록해 봐요</div>
                                                </div>
                                                <img
                                                    src={visibleColumnsMap["no_project_1"]?.["no_column_2"] ? "/images/arrow-top.png" : "/images/arrow-bot.png"}
                                                    alt=""
                                                    className="h-[8px] w-[13px]"
                                                />    
                                            </div>
                                            {visibleColumnsMap["no_project_1"]?.["no_column_2"] && (
                                            <>
                                                <div className='project-inbox'>
                                                    <p className='project-title'>작업자를 검색해서 등록할 수 있어요</p>
                                                    <p className='project-content'>사내 프로젝트를 함께 진행해요</p>
                                                </div>
                                            </>)}
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-10">
                                    <div className='flex justify-end text-sm text-gray-700 text-extralight'>완료 0%</div>
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{width: `0%`}}></div>
                                    </div>
                                </div>
                            </li>
                        </>
                ) : (
                    <>
                        {data.map((n) => {
                            const projectProgress = progressMap[n.projectId] || 0;

                            const formattedColumns = n.getProjectColumn.map((column) => {
                                const formattedTasks = column.tasks.map((task) => {
                                    const formattedDueDate = getFormattedDueDate(task.duedate);
                                    const dateColor = getDateColor(formattedDueDate);
                                    return {
                                        ...task,
                                        formattedDueDate,
                                        dateColor,
                                    };
                                });
                                return {
                                    ...column,
                                    tasks: formattedTasks,
                                };
                            });

                            return (
                                <li className="home-project flex flex-col justify-between" key={n.projectId}>
                                    <Link to={"/project"}>
                                        <div className="flex justify-between">
                                            <h2 className="text-xl flex items-center">{n.projectName}</h2>
                                            <div className="flex items-center border rounded-lg px-2 h-[25px] relative top-1">
                                                <span className="text-xs text-gray-500">상세보기</span>
                                                <img className="ml-2 h-[15px] w-[15px]" src="/images/ArrowForward.png" alt="" />
                                            </div>
                                        </div>
                                    </Link>
                                    <div className="h-[290px] overflow-scroll scrollbar-none">
                                        <div className="mt-[10px]">
                                        {formattedColumns.map((column) => (
                                            <div key={column.id}>
                                                <div
                                                    className="flex items-center cursor-pointer justify-between"
                                                    onClick={() => toggleColumnVisibility(n.projectId, column.id)} // 토글 기능 추가
                                                >
                                                    <div className="flex items-center">
                                                        <div
                                                            className={`border-4 border-[${column.color}] rounded-full w-[15px] h-[15px] mr-2`}
                                                        ></div>
                                                        <div>{column.title}</div>
                                                    </div>
                                                    <img
                                                        src={visibleColumnsMap[n.projectId]?.[column.id] ? "/images/arrow-top.png" : "/images/arrow-bot.png"}
                                                        alt=""
                                                        className="h-[8px] w-[13px]"
                                                    />
                                                </div>
                                                {visibleColumnsMap[n.projectId]?.[column.id] && (
                                                    <div className="">
                                                        {column.tasks.map((t) => (
                                                            <div className="project-inbox flex justify-between" key={t.taskId}>
                                                                <div>
                                                                    <p className="project-title">{t.title}</p>
                                                                    <p className="project-content">{t.content}</p>
                                                                </div>
                                                                <div className="flex flex-col items-end">
                                                                    <div className="h-full">
                                                                        {t?.duedate && (
                                                                            <div
                                                                                className={`flex items-center gap-1.5 text-xs ${t.dateColor}`}
                                                                                aria-label={`마감일: ${t.duedate} (${t.formattedDueDate})`}
                                                                            >
                                                                                {t.formattedDueDate}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center w-[60px]">
                                                                        <span className="text-xs flex items-end h-full mr-2">
                                                                            <img className="w-[15px] h-[15px] mr-1" src="/images/people-icon.png" alt="" />
                                                                            0
                                                                        </span>
                                                                        <span className="text-xs flex items-end h-full">
                                                                            <svg fill="#a6a6a6" width="16px" height="16px" className="ico mr-1">
                                                                                <use href={`/images/project-linked-sprite.svg#comment`} />
                                                                            </svg>
                                                                            2
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        </div>
                                    </div>
                                    <div className="mb-10">
                                        <div className="flex justify-end text-sm text-gray-700 text-extralight">완료 {projectProgress}%</div>
                                        <div className="progress-bar">
                                            <div className={`progress-fill bg-${progressColor}-500`}  style={{ width: `${projectProgress}%` }}></div>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </>
                )}
            </ul>
        </>
    )
}

export default HomeProject;