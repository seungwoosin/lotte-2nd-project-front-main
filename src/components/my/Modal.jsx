import { now } from "lodash";
import useOnClickOutSide from "../message/useOnClickOutSide"; 



export const MyModal = ({ isOpen, onClose , text,  showMoreRef }) => {
    if (!isOpen) return null;
    const date = new Date();

    useOnClickOutSide(showMoreRef, onClose);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 modal-custom-fixed">
      <div ref={showMoreRef}  
      className="bg-white rounded-t-xl rounded-b-md shadow-lg max-w-2xl w-full modal-custom-width">
        <div className="flex justify-between items-center py-5 px-12 bg-white rounded-t-xl">
            <span className="text-lg text-gray-700 font-bold">{text}</span>
            <button 
            onClick={onClose}
            className="text-md float-right display-block font-bold text-gray-600 hover:text-gray-900"
            >
            <img className="h-[15px]" src="/images/close-icon.png" alt="close" />
            </button>
        </div>
        <div className="mx-12">
          {text === '연차 신청' && 
            <>
              <div className="mb-6 flex justify-between">
                <div className="w-2/5 flex flex-col justify-between h-[260px]">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">기안자</label>
                    <input className="indent-2  block w-full p-2 border rounded" placeholder="기안자명" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">기안부서</label>
                    <input className="indent-2  block w-full p-2 border rounded" placeholder="부서명" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">기안일</label>
                    <input className="indent-2  block w-full p-2 border rounded" defaultValue={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">문서번호</label>
                    <input className="indent-2  block w-full p-2 border rounded" defaultValue="2024-001" />
                  </div>
                </div>
                <div className="w-2/5">
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700">승인</label>
                    <input className="indent-2  block w-full p-2 border rounded" placeholder="승인자 직책" />
                  </div>
                  <div>
                    <input className="indent-2  block w-full p-2 border rounded" placeholder="승인자명" />
                  </div>
                </div>
              </div>

              {/* Leave Request Section */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">휴가 종류</label>
                  <select className="block w-full p-2 border rounded h-[42px]">
                    <option>연차</option>
                    <option >반차</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">시작일</label>
                  <input type="date" className="block w-full p-2 border rounded h-[42px]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">종료일</label>
                  <input type="date" className="block w-full p-2 border rounded h-[42px]" />
                </div>
              </div>
              {/* <div className="grid grid-cols-2 gap-6 mt-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">시작시간</label>
                  <input type="time" className="block w-full p-2 border rounded h-[42px]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">종료시간</label>
                  <input type="time" className="block w-full p-2 border rounded h-[42px]" />
                </div>
              </div> */}

              {/* Remaining Leave Section */}
              <div className="grid grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">잔여 연차</label>
                  <div className="p-2 bg-gray-200 rounded">11</div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">신청 연차</label>
                  <input
                    type="number"
                    className="block w-full p-2 border rounded"
                    placeholder="0"
                  />
                </div>
              </div>
              <p className="text-sm text-red-600 mb-6">
                신청 가능한 연차일수를 초과하였습니다.
              </p>

              {/* File Upload Section */}
              <div>
                <label className="block text-sm font-semibold text-gray-700">파일 첨부</label>
                <div className="flex items-center justify-center w-full p-4 border-2 border-dashed rounded">
                  이 곳에 파일을 드래그 하세요. 또는 파일 선택
                </div>
              </div>

              {/* Buttons Section */}
              <div className="mt-6 flex gap-4 justify-center mb-6">
                <button className="px-6 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">
                  연차 신청
                </button>
                {/* <button className="px-6 py-2 border border-gray-400 text-gray-700 rounded hover:bg-gray-100">
                  임시 저장
                </button> */}
                <button className="px-6 py-2 border border-gray-400 text-gray-700 rounded hover:bg-gray-100">
                  취소
                </button>
                {/* <button className="px-6 py-2 border border-indigo-500 text-indigo-700 rounded hover:bg-indigo-100">
                  연차 어쩌고
                </button> */}
              </div>
            </>
          }
          
        </div>
        
      </div>
    </div>
  );
};
