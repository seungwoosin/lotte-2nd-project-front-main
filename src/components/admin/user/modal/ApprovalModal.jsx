import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import axiosInstance from '@/services/axios.jsx'

export default function ApprovalModal({onClose,isOpen,userId}) {
    if(!isOpen) return null;

    const queryClient = useQueryClient();

    const [level, setLevel] = useState(0);
    const [joinDate, setJoinDate] = useState("");

    const mutation = useMutation({
        mutationFn: async () => {
            const response = await axiosInstance.patch('/api/admin/user/approval', {
                level,
                joinDate,
                userId
            });
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['approvals']);
            onClose();
        },
        onError: (error) => {
            console.error("Error updating user", error);
        },
    });

    const patchUser = async () => {
        try {
            await mutation.mutateAsync(); 
        } catch (error) {
            console.error("Error in mutation", error);
        }
    };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 modal-custom-fixed">
        <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-[400px]">
            <div className="display-flex mb-8 py-5 px-12 bg-gray-300 rounded-t-2xl">
                <span className="text-2xl">직원 추가정보 입력</span>
                <button 
                onClick={onClose}
                className="text-xl float-right display-block font-bold text-gray-600 hover:text-gray-900"
                >
                닫기
                </button>
            </div>
            <div className="modal-content mx-12">
                <div className="flex gap-8 mb-4 justify-start items-center">
                    <span className="w-20">직급</span>
                    <div>
                        <select className='border p-1' value={level} onChange={(e)=>setLevel(e.target.value)}>
                            <option value={1}>사원</option>
                            <option value={2}>주임</option>
                            <option value={3}>대리</option>
                            <option value={4}>과장</option>
                            <option value={5}>차장</option>
                            <option value={6}>부장</option>
                        </select>
                    </div>
                </div>
                <div className="flex gap-8 mb-4 justify-start items-center">
                    <span className="w-20">입사년도</span>
                    <div>
                        <input value={joinDate} onChange={(e)=>setJoinDate(e.target.value)} className='border p-1' type='date'></input>
                    </div>
                </div>
                <div className='mt-8 flex justify-center'>
                    <button onClick={patchUser} className='bg-purple white rounded-md w-[100px] h-[30px] hover:opacity-80'>승인</button>
                </div>
            </div>
        </div>
    </div>
  )
}
