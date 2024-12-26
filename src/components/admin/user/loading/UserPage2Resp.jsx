import React from 'react'

export default function UserPage2Resp({text}) {
  return (
    <section className="overflow-auto max-h-[300px] scrollbar-none px-[40px]">
            <table className="w-full table-auto border-collapse mb-16">
            <thead className='bg-gray-200 h-16 sticky top-0 z-10'>
                <tr className='text-center'>
                    <th className="w-1/12 rounded-tl-lg"><input type="checkbox" /></th>
                    <th className="w-1/12">번호</th>
                    <th className="w-2/12">이름</th>
                    <th className="w-1/12">이메일</th>
                    <th className="w-1/12">아이디</th>
                    <th className="w-3/12">가입일자</th>
                    <th className="w-1/12 rounded-tr-lg">승인</th>
                </tr>
            </thead>
        </table>
        <div className='flex justify-center items-center'>{text}...</div>
    </section>
  )
}
