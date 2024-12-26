import React, { useEffect, useState } from 'react'
import '@/pages/admin/Admin.scss'
import {CustomSearch} from '@/components/Search'
import { CustomButton } from '../../components/Button';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import Page from '../../components/Page';

export default function AdminCommunity() {
    const [selectOption, setSelectOption] = useState(0);
    const optionChanger = (e)=>{
        setSelectOption(Number(e.target.value))
        console.log(selectOption)
    }

    const userHandler = (e) => {

    }
  return (
    <div id='admin-community-container'>
      <AdminSidebar />
      <section className='admin-community-main'>
        <AdminHeader />
        {selectOption === 0 &&
            <>
                
                <section className='flex items-center gap-4 mb-12'>
                    <div className='ml-4 text-2xl'>
                        <select value={selectOption} onChange={optionChanger} className='outline-none border rounded-md text-xl p-2'>
                            <option value={0}>신고된 게시물</option>
                            <option value={1}>공지사항</option>
                        </select>
                    </div>
                    <div className='ml-auto flex'>
                        <CustomSearch 
                            width1='40'
                            width2='72'
                        />
                    </div>
                    <select className='text-center opacity-80 w-24 h-10 outline-none border'>
                        <option>회사명</option>
                        <option>번호</option>
                        <option>파견부서</option>
                        <option>결제일</option>
                    </select>
                    <div>7 / 11</div>
                </section>
                <table className="w-full table-auto border-collapse mb-16">
                    <thead className='bg-gray-200 h-16'>
                        <tr className='text-center'>
                            <th className="w-1/10 rounded-tl-lg"><input type="checkbox" /></th>
                            <th className="w-1/10">번호</th>
                            <th className="w-1/10">제목</th>
                            <th className="w-2/10">신고사유</th>
                            <th className="w-1/10">작성자</th>
                            <th className="w-1/10">신고횟수</th>
                            <th className="w-2/10">작성일</th>
                            <th className="w-2/10">관리</th>
                        </tr>
                    </thead>
                    <tbody className='h-16'>
                        <tr className='text-center'>
                            <td className="w-1/10"><input type="checkbox" /></td>
                            <td className="w-1/10">1</td>
                            <td className="w-1/10">홍길동</td>
                            <td className="w-2/10">개발</td>
                            <td className="w-1/10">활동</td>
                            <td className="w-1/10">정상</td>
                            <td className="w-2/10">사원</td>
                            <td className="w-2/10">2024-01-01</td>
                        </tr>
                    </tbody>
                    <tbody className='h-16'>
                        <tr className='text-center'>
                            <td className="w-1/10"><input type="checkbox" /></td>
                            <td className="w-1/10">1</td>
                            <td className="w-1/10">홍길동</td>
                            <td className="w-2/10">개발</td>
                            <td className="w-1/10">활동</td>
                            <td className="w-1/10">정상</td>
                            <td className="w-2/10">사원</td>
                            <td className="w-2/10">2024-01-01</td>
                        </tr>
                    </tbody>
                    <tbody className='h-16'>
                        <tr className='text-center'>
                            <td className="w-1/10"><input type="checkbox" /></td>
                            <td className="w-1/10">1</td>
                            <td className="w-1/10">홍길동</td>
                            <td className="w-2/10">개발</td>
                            <td className="w-1/10">활동</td>
                            <td className="w-1/10">정상</td>
                            <td className="w-2/10">사원</td>
                            <td className="w-2/10">2024-01-01</td>
                        </tr>
                    </tbody>
                </table>    
                <section className='flex justify-between'>
                        <button className='bg-blue white h-10 p-4 flex items-center rounded-md'>선택삭제</button>
                </section>
                <section className="flex justify-center mt-20">
                    <div className="flex items-center space-x-2">
                        <button className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-200">
                            <span className="hidden sm:inline">이전</span>
                            <svg className="w-4 h-4 sm:hidden" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path d="M15 19l-7-7 7-7"></path>
                            </svg>
                        </button>
                        <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg text-sm font-semibold hover:from-blue-400 hover:to-indigo-400">
                        1
                        </button>
                        <button className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-400">
                        2
                        </button>
                        <button className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-400">
                        3
                        </button>
                        <button className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-200">
                            <span className="hidden sm:inline">다음</span>
                            <svg className="w-4 h-4 sm:hidden" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path d="M9 5l7 7-7 7"></path>
                            </svg>
                        </button>
                    </div>
                </section>
            </>
            
            }
            {selectOption === 1 &&
            <>
                
                <section className='flex items-center gap-4 mb-12'>
                    <div className='ml-4 text-2xl'>
                        <select value={selectOption} onChange={optionChanger} className='outline-none border rounded-md text-xl p-2 text-center'>
                            <option value={0}>신고된 게시물</option>
                            <option value={1}>공지사항</option>
                        </select>
                    </div>
                    <div className='ml-auto flex'>
                        <CustomSearch 
                            width1='40'
                            width2='72'
                        />
                    </div>
                    <select className='text-center opacity-80 w-24 h-10 outline-none border'>
                        <option>회사명</option>
                        <option>번호</option>
                        <option>파견부서</option>
                        <option>결제일</option>
                    </select>
                    <div>7 / 11</div>
                </section>
                <table className="w-full table-auto border-collapse mb-16">
                    <thead className='bg-gray-200 h-16'>
                        <tr className='text-center'>
                            <th className="w-1/10 rounded-tl-lg"><input type="checkbox" /></th>
                            <th className="w-1/10">번호</th>
                            <th className="w-1/10">제목</th>
                            <th className="w-2/10">분류</th>
                            <th className="w-1/10">읽기권한</th>
                            <th className="w-1/10">작성자</th>
                            <th className="w-2/10">작성일</th>
                            <th className="w-2/10">관리</th>
                        </tr>
                    </thead>
                    <tbody className='h-16'>
                        <tr className='text-center'>
                            <td className="w-1/10"><input type="checkbox" /></td>
                            <td className="w-1/10">1</td>
                            <td className="w-1/10">홍길동</td>
                            <td className="w-2/10">개발</td>
                            <td className="w-1/10">활동</td>
                            <td className="w-1/10">정상</td>
                            <td className="w-2/10">사원</td>
                            <td className="w-2/10">2024-01-01</td>
                        </tr>
                    </tbody>
                    <tbody className='h-16'>
                        <tr className='text-center'>
                            <td className="w-1/10"><input type="checkbox" /></td>
                            <td className="w-1/10">1</td>
                            <td className="w-1/10">홍길동</td>
                            <td className="w-2/10">개발</td>
                            <td className="w-1/10">활동</td>
                            <td className="w-1/10">정상</td>
                            <td className="w-2/10">사원</td>
                            <td className="w-2/10">2024-01-01</td>
                        </tr>
                    </tbody>
                    <tbody className='h-16'>
                        <tr className='text-center'>
                            <td className="w-1/10"><input type="checkbox" /></td>
                            <td className="w-1/10">1</td>
                            <td className="w-1/10">홍길동</td>
                            <td className="w-2/10">개발</td>
                            <td className="w-1/10">활동</td>
                            <td className="w-1/10">정상</td>
                            <td className="w-2/10">사원</td>
                            <td className="w-2/10">2024-01-01</td>
                        </tr>
                    </tbody>
                </table>    
                <section className='flex justify-between'>
                        <button className='bg-blue white h-10 p-4 flex items-center rounded-md'>선택삭제</button>
                        <button className='bg-blue white h-10 p-4 flex items-center rounded-md'>공지사항 등록</button>
                </section>
                <Page />
            </>
            }
        </section>
    </div>
  )
}
