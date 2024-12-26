import React, { useEffect, useState } from 'react'
import CustomAlert from '../Alert'
import { useQueryClient } from '@tanstack/react-query';

export default function PutScheduleModal({ isOpen, onClose, children , text, putData, oldData ,setPutData}) {
    const [title,setTitle] = useState("");
    const [sdate,setSdate] = useState("");
    const [edate,setEdate] = useState("");
    const [calendarId,setCalendarId] = useState(0);
    const [updatePrevData,setUpdatePrevData] = useState(false);
    const [alert,setAlert] = useState(false);
    const queryClient = useQueryClient();
    
    useEffect(()=>{
        if(oldData){
          setTitle(oldData.title)
          setSdate(oldData.startDate)
          setEdate(oldData.endDate)
          setCalendarId(oldData.contentId)
          console.log(oldData)
        }
        
      },[oldData])

    const temporaryPut = () =>{
        setPutData((prev) => {
            const updatedData = prev.map(item => 
            item.contentId == calendarId
                ? { ...item, 
                    title: title, 
                    startDate: new Date(sdate).toLocaleString('sv-SE'), 
                    endDate: new Date(edate).toLocaleString('sv-SE')
                }
                : item
            );
            
            if (!updatedData.some(item => item.contentId == calendarId)) {
            updatedData.push({
                title: title, 
                startDate: new Date(sdate).toLocaleString('sv-SE'), 
                endDate: new Date(edate).toLocaleString('sv-SE'), 
                contentId: calendarId
            });
            }
            
            return updatedData;
        });
        
        setUpdatePrevData(true)

    }

    useEffect(()=>{
        if(updatePrevData){
            queryClient.setQueryData(['calendar-date'], (prevData) => {
            
                // prevData가 배열인 경우에만 처리
                const updatedData = prevData
                    ? prevData.map((item) => {
                        // putData 배열을 순회하면서 각 item.contentId와 비교
                        const updatedItem = putData.find(data => String(data.contentId) === String(item.id));
                        
                        // contentId가 일치하는 항목을 찾으면 해당 항목을 업데이트
                        if (updatedItem) {
                            return {
                                ...item,
                                title: updatedItem.title,  // putData에서 받은 새로운 title 값
                                start: updatedItem.startDate,  // putData에서 받은 새로운 startDate 값
                                end: updatedItem.endDate,  // putData에서 받은 새로운 endDate 값
                                color: item.color,  // 기존 color는 그대로 유지
                            };
                        }
                        // 일치하지 않으면 기존 item 그대로 반환
                        return item;
                    })
                    : [];
            
                return updatedData;
            });

        setTimeout(() => {
            onClose();    
        }, 1000);
        }
    },[updatePrevData])

    if(!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 modal-custom-fixed">
      {/* <CustomAlert 
        type={customAlertType} message={customAlertMessage} isOpen={customAlert}
      /> */}
      <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-[600px] modal-custom-width max-h-[600px] overflow-scroll scrollbar-none">
        <div className="display-flex mb-8 py-5 px-12 bg-gray-300 rounded-t-2xl z-10 sticky top-0">
            <span className="text-2xl">{text}</span>
            <button 
            onClick={onClose}
            className="text-xl float-right display-block font-bold text-gray-600 hover:text-gray-900"
            >
            닫기
            </button>
        </div>
        <div className="mx-12">
        <div className="flex gap-8 mb-4 justify-start">
              <span className="w-20 h-[40px]">제목</span>
              <div>
                <input onChange={(e)=>setTitle(e.target.value)} value={title} className="h-[40px] w-[250px] border rounded-md px-2"></input>
              </div>
            </div>
            <div className="flex gap-8 justify-start mb-4">
              <span className="w-20 h-[40px]">날짜</span>
              <div className="flex gap-3 items-center">
                <input value={sdate} onChange={(e)=>setSdate(e.target.value)} className='h-[40px] w-[113px]' type="datetime-local"></input> ~ <input value={edate} onChange={(e)=>setEdate(e.target.value)} className='h-[40px] w-[113px]' type="datetime-local"></input>
              </div>
            </div>
            <div className="flex justify-end mb-12">
                <button onClick={temporaryPut} className='bg-purple px-6 py-4 text-xs rounded-md white'>수정하기</button>
            </div>
        </div>
        </div>
        <CustomAlert 
        type="info"
        message="수정하기를 클릭하셔야 최종 수정됩니다."
        isOpen={alert}
      />
    </div>
  )
}
