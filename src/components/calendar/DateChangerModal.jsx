import React, { useEffect, useState } from 'react'
import PostScheduleModal from './PostScheduleModal';
import PutScheduleModal from './PutScheduleModal';

export default function DateChangerModal({dateChanger,onclose,data,putData,setPutData}) {

    const [page,setPage] = useState(0);
    if(!dateChanger) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 modal-custom-fixed">
      <div className="bg-white z-40 rounded-2xl shadow-lg w-[400px] modal-custom-width max-h-[600px] overflow-scroll scrollbar-none">
            {page===0 &&
            <>
            <div className="display-flex  py-5 px-12 border-b rounded-t-2xl z-10">
                <span className="text-[15px] font-bold">기간을 수정하시겠습니까?</span>
            </div>
            <div className='flex py-8 justify-around items-center'>
                <button 
                className="text-[15px] display-block font-bold text-gray-600 hover:text-blue-500"
                onClick={()=>{setPage(1);}}
                >
                네
                </button>
                <button 
                className="text-[15px] display-block font-bold text-gray-600 hover:text-red-500"
                onClick={onclose}
                >
                아니오
                </button>
            </div>
            </>
            }
            {page===1 &&
            <PutScheduleModal 
                isOpen={true}
                onClose={onclose}
                text="일정 수정"
                putData={putData}
                oldData={data}
                setPutData={setPutData}
            />
            }
            
        </div>
    </div>
  )
}
