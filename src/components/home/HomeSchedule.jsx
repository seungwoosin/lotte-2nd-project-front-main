import { useQuery } from "@tanstack/react-query";
import axiosInstance from '@/services/axios.jsx'
import useUserStore from '../../store/useUserStore';
import { Link } from "react-router-dom";

const HomeSchedule = () => {
    const user = useUserStore((state)=> state.user);
    const now = new Date();
    const currentDateTime = new Intl.DateTimeFormat('ja-JP', {
            timeZone: 'Asia/Seoul',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          }).format(now);
    
    const getScheduleAPI = async () => {
        if (!user?.uid) {
            throw new Error("유저 정보가 없습니다.");
        }
        const resp = await axiosInstance.get('/api/calendar/content/name/today');
        console.log("오늘 스케줄 데이터 조회 " + JSON.stringify(resp.data));
        return Array.isArray(resp.data) ? resp.data : {};
    };

    const { data: scheduleData, isError: scheduleError, isLoading: scheduleLoading } = useQuery({
        queryKey: [`schedule-${user.uid}`],
        queryFn: getScheduleAPI,
        enabled: Boolean(user?.uid),
        initialData: [],
    });

    const getScheduleNextAPI = async () => {
        if (!user?.uid) {
            throw new Error("유저 정보가 없습니다.");
        }

        const resp = await axiosInstance.get('/api/calendar/content/name/next');
        console.log("내일이나 다음주 스케줄 데이터 조회 "+JSON.stringify(resp.data));
        return resp.data || {};
    }

    const { data: nextData, isError: nextError, isLoading: nextLoading } = useQuery({
        queryKey: [`next-schedule-${user.uid}`],
        queryFn: getScheduleNextAPI,
        enabled: Boolean(user?.uid),
        initialData: {},
    });

    
    return(
        <>
            <div className="flex justify-between">
                <h2 className='text-2xl mb-1'>Schedule</h2>
                <Link to={"/calendar"}className='flex justify-between items-center text-gray-600 border border-gray-400 rounded-lg px-3 h-[28px]'>
                    <span>일정 보기</span>
                    <img className='ml-2 w-[20px] h-[20px]' src="/images/ArrowForward.png" alt="allow" />
                </Link>
            </div>
            {(scheduleLoading || nextLoading) ? (
                <p>로딩 중...</p>
            ) : (scheduleError || nextError) ? (
                <p>데이터를 불러오는 데 실패했습니다.</p>
            ) : ((!Array.isArray(scheduleData) || scheduleData.length === 0) && 
                (nextData == null || Object.keys(nextData).length === 0)) ? (
                    <>
                    <div className='h-[70px] mt-1 border rounded-lg py-2 px-4 flex items-center mt-[10px]'>
                        <div className={`w-[12px] h-[12px] rounded-full mr-2 bg-gray-300`}></div>
                        <div className='ml-10'>
                        <div className='flex items-center'>
                            <p className='mr-10'>최근 한 주간 등록된 일정이 없습니다</p>
                        </div>
                        <p className='schedule-content'>일정을 등록해 보세요!</p>
                        </div>
                    </div>
                    <Link to={"/calendar"} className='h-[70px] mt-1 border rounded-lg py-2 px-4 flex items-center mt-1 w-full'>
                        <div className={`w-[12px] h-[12px] rounded-full mr-2 bg-green-500`}></div>
                        <div className='flex items-center justify-between w-full'>
                        <p className='ml-10'>일정 등록하러 가기</p>
                        <img className="w-[30px]" src="/images/ArrowForward.png" alt="" />
                        </div>
                    </Link>
                    </>
            ) : (
                <>
                    {/* 오늘 스케줄이 있는 경우 렌더링 */}
                    {!scheduleData || !Array.isArray(scheduleData) ? null : (
                    <div>
                        <p>오늘 <span className='text-sm'>({currentDateTime})</span></p>
    
                        {scheduleData.map((schedule) => {
                            return (
                            <div key={schedule.id} className='h-[60px] mt-1 border rounded-lg py-2 px-4 flex items-center'>
                                <div className={`w-[12px] h-[12px] rounded-full mr-2 ${
                                schedule.color ? `bg-${schedule.color}-500` : 'bg-gray-200'
                                }`}></div>
                                <div className='ml-10'>
                                <div className='flex items-center'>
                                    <p className='mr-10'>{schedule.stime}</p>
                                    <span>{schedule.name}</span>
                                </div>
                                <p className='schedule-content'>{schedule?.memo||'메모 없음'}</p>
                                </div>
                            </div>
                            );
                        })}
                    </div>
                    )}

                    {/* 다음 스케줄이 있는 경우 렌더링 */}
                    { nextData == null || Object.keys(nextData).length === 0 ? null : (
                        Object.entries(nextData).map(([key, schedules]) => {
                            // schedules가 배열인지 확인
                            const validSchedules = Array.isArray(schedules) ? schedules : [];
                            
                            // 오늘 일정 개수 계산
                            const todayScheduleCount = Array.isArray(scheduleData) ? scheduleData.length : 0;
                            
                            // 빈 슬롯 계산 (최대 3개로 제한)
                            const availableSlots = Math.max(0, 3 - todayScheduleCount);
                            
                            // 제한된 일정 추출
                            const limitedSchedules = validSchedules.slice(0, availableSlots);
                            
                            // 렌더링할 일정이 없으면 null 반환
                            if (limitedSchedules.length === 0) return null;
                            
                            return (
                                <div key={key} className='mt-2'>
                                    <p>{key === 'tomorrow' ? '내일' : '다음 주'}</p>
                                    {limitedSchedules.map((schedule) => (
                                        <div 
                                            key={schedule.id}
                                            className='h-[60px] mt-1 border rounded-lg py-2 px-4 flex items-center'
                                        >
                                            <div
                                                className={`w-[12px] h-[12px] rounded-full mr-2 ${
                                                    schedule.color ? `bg-${schedule.color}-500` : 'bg-gray-200'
                                                }`}
                                            ></div>
                                            <div className='ml-10'>
                                                <div className='flex items-center'>
                                                    <p className='mr-10'>{schedule.stime}</p>
                                                    <span>{schedule.name}</span>
                                                </div>
                                                <p className='schedule-content'>{schedule.memo || '메모 없음'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            );
                        }).filter(Boolean) // null 값 제거
                    )}
                </>
            )}
        </>
    )
}

export default HomeSchedule;