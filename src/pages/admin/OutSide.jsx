import React, { useState } from 'react'
import '@/pages/admin/Admin.scss'
import {CustomSearch} from '@/components/Search'
import { CustomButton } from '../../components/Button';
import { PieChart } from 'recharts';
import PieChartComponent from '../../components/PieChart';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import Page from '../../components/Page';
export default function AdminOutSide() {
    const [selectOption, setSelectOption] = useState(0);

    const optionChanger = (e)=>{
        setSelectOption(Number(e.target.value))
        console.log(selectOption)
    }

    const userHandler = (e) => {

    }
  return (
    <div id='admin-outside-container'>
      <AdminSidebar />
      <section className='admin-outside-main'>
      <AdminHeader />
        {selectOption === 0 &&
        <>
            
            <section className='flex items-center gap-4 mb-24'>
                <div className='ml-4 text-2xl'>
                    <select value={selectOption} onChange={optionChanger} className='outline-none border rounded-md text-xl p-2 text-center'>
                        <option value={0}>외근 현황</option>
                        <option value={1}>외근 일정</option>
                        <option value={2}>법인카드</option>
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
            <section className='flex justify-around'>
                <div>
                    <h1 className='mb-8 ml-8 font-bold'>외근 현황</h1>
                    <PieChartComponent />
                </div>
                <div>
                    <h1 className='mb-8 ml-8 font-bold'>경비 지출</h1>
                    <PieChartComponent />
                </div>
            </section>
        </>
        }
        {selectOption === 1 &&
        <>
            
            <section className='flex items-center gap-4 mb-16'>
                <div className='ml-4 text-2xl'>
                    <select value={selectOption} onChange={optionChanger} className='outline-none border rounded-md text-xl p-2 text-center'>
                        <option value={0}>외근 현황</option>
                        <option value={1}>외근 일정</option>
                        <option value={2}>법인카드</option>
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
            <section>
                <table className='w-full'>
                    <thead className='h-16 bg-gray-100'>
                        <tr>
                            <th>이름</th>
                            <th>시작일</th>
                            <th>종료일</th>
                            <th>파견업체</th>
                            <th>전화번호</th>
                            <th>법인카드</th>
                            <th>숙박업소</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className='h-16 text-center'>
                            <td>이상훈</td>
                            <td>2024-11-21</td>
                            <td>2024-11-23</td>
                            <td>서버점검</td>
                            <td>010-4646-8979</td>
                            <td>XXXX-XXXX-XXXX-XXXX</td>
                            <td>역전호스텔</td>
                        </tr>
                        <tr className='h-16 text-center'>
                            <td>이상훈</td>
                            <td>2024-11-21</td>
                            <td>2024-11-23</td>
                            <td>서버점검</td>
                            <td>010-4646-8979</td>
                            <td>XXXX-XXXX-XXXX-XXXX</td>
                            <td>역전호스텔</td>
                        </tr>
                        <tr className='h-16 text-center'>
                            <td>이상훈</td>
                            <td>2024-11-21</td>
                            <td>2024-11-23</td>
                            <td>서버점검</td>
                            <td>010-4646-8979</td>
                            <td>XXXX-XXXX-XXXX-XXXX</td>
                            <td>역전호스텔</td>
                        </tr>
                        <tr className='h-16 text-center'>
                            <td>이상훈</td>
                            <td>2024-11-21</td>
                            <td>2024-11-23</td>
                            <td>서버점검</td>
                            <td>010-4646-8979</td>
                            <td>XXXX-XXXX-XXXX-XXXX</td>
                            <td>역전호스텔</td>
                        </tr>
                        <tr className='h-16 text-center'>
                            <td>이상훈</td>
                            <td>2024-11-21</td>
                            <td>2024-11-23</td>
                            <td>서버점검</td>
                            <td>010-4646-8979</td>
                            <td>XXXX-XXXX-XXXX-XXXX</td>
                            <td>역전호스텔</td>
                        </tr>
                    </tbody>
                </table>
            </section>
            <section className="flex justify-center mt-20">
                <div   div className="flex items-center space-x-2">
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
        {selectOption === 2 &&
        <>
            
            <section className='flex items-center gap-4 mb-16'>
                <div className='ml-4 text-2xl'>
                    <select value={selectOption} onChange={optionChanger} className='outline-none border rounded-md text-xl p-2 text-center'>
                        <option value={0}>외근 현황</option>
                        <option value={1}>외근 일정</option>
                        <option value={2}>법인카드</option>
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
            <section>
                <table className='w-full'>
                    <thead className='h-16 bg-gray-100 '>
                        <tr>
                            <th className='rounded-tl-lg'>사용자</th>
                            <th>카드번호</th>
                            <th>일일한도</th>
                            <th>남은한도</th>
                            <th>총사용금액</th>
                            <th>사용처</th>
                            <th>영수증</th>
                            <th className='rounded-tr-lg'>사용날짜</th>
                            <th>관리하기</th>
                        </tr>
                    </thead>
                    <tbody>
                    <tr className='h-16 text-center'>
                            <td>이상훈</td>
                            <td>XXXX-XXXX-XXXX-XXXX</td>
                            <td>12,000</td>
                            <td>1,500</td>
                            <td>36,000</td>
                            <td>점심</td>
                            <td>첨부사진</td>
                            <td>2024-11-21</td>
                            <td>
                                <div className='flex gap-2 justify-center'>
                                    <button className='bg-red-300 p-2 text-xs white rounded-lg'>정지</button>
                                    <button className='bg-blue-300 p-2 text-xs white rounded-lg'>한도</button>
                                </div>
                            </td>
                        </tr>
                        <tr className='h-16 text-center'>
                            <td>이상훈</td>
                            <td>XXXX-XXXX-XXXX-XXXX</td>
                            <td>12,000</td>
                            <td>1,500</td>
                            <td>36,000</td>
                            <td>점심</td>
                            <td>첨부사진</td>
                            <td>2024-11-21</td>
                            <td>
                                <div className='flex gap-2 justify-center'>
                                    <button className='bg-red-300 p-2 text-xs white rounded-lg'>정지</button>
                                    <button className='bg-blue-300 p-2 text-xs white rounded-lg'>한도</button>
                                </div>
                            </td>
                        </tr>
                        <tr className='h-16 text-center'>
                            <td>이상훈</td>
                            <td>XXXX-XXXX-XXXX-XXXX</td>
                            <td>12,000</td>
                            <td>1,500</td>
                            <td>36,000</td>
                            <td>점심</td>
                            <td>첨부사진</td>
                            <td>2024-11-21</td>
                            <td>
                                <div className='flex gap-2 justify-center'>
                                    <button className='bg-red-300 p-2 text-xs white rounded-lg'>정지</button>
                                    <button className='bg-blue-300 p-2 text-xs white rounded-lg'>한도</button>
                                </div>
                            </td>
                        </tr>
                        <tr className='h-16 text-center'>
                            <td>이상훈</td>
                            <td>XXXX-XXXX-XXXX-XXXX</td>
                            <td>12,000</td>
                            <td>1,500</td>
                            <td>36,000</td>
                            <td>점심</td>
                            <td>첨부사진</td>
                            <td>2024-11-21</td>
                            <td>
                                <div className='flex gap-2 justify-center'>
                                    <button className='bg-red-300 p-2 text-xs white rounded-lg'>정지</button>
                                    <button className='bg-blue-300 p-2 text-xs white rounded-lg'>한도</button>
                                </div>
                            </td>
                        </tr>
                        <tr className='h-16 text-center'>
                            <td>이상훈</td>
                            <td>XXXX-XXXX-XXXX-XXXX</td>
                            <td>12,000</td>
                            <td>1,500</td>
                            <td>36,000</td>
                            <td>점심</td>
                            <td>첨부사진</td>
                            <td>2024-11-21</td>
                            <td>
                                <div className='flex gap-2 justify-center'>
                                    <button className='bg-red-300 p-2 text-xs white rounded-lg'>정지</button>
                                    <button className='bg-blue-300 p-2 text-xs white rounded-lg'>한도</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
            <Page />
        </>
        }
    </section>
    </div>
  )
}
