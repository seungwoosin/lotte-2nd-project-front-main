import React from 'react'

export default function UserPage1Resp({text}) {
  return (
    <section className="overflow-auto max-h-[300px] scrollbar-none px-[40px]">
        <table className="w-full table-auto border-collapse mb-16">
            <thead className='bg-gray-200 h-16 sticky top-0 z-10'>
                <tr className='text-center'>
                    <th className="w-[133px] rounded-tl-lg">번호</th>
                    <th className="w-[273px]">이름</th>
                    <th className="w-[133px]">상태</th>
                    <th className="w-[133px]">근태</th>
                    <th className="w-[133px]">직급</th>
                    <th className="w-[273px]">가입일자</th>
                    <th className="w-[133px] rounded-tr-lg">비고</th>
                </tr>
            </thead>
        </table>
        <div className='flex justify-center items-center'>{text}...</div>
    </section>
  )
}
