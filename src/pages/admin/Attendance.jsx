import React, { useState } from 'react'
import '@/pages/admin/Admin.scss'
import {CustomSearch} from '@/components/Search'
import { CustomButton } from '../../components/Button';
import MyChart from '../../components/Chart';
import AttendanceChart from '../../components/Chart';
import { PieChart } from 'recharts';
import PieChartComponent from '../../components/PieChart';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';

export default function AdminAttendance() {
    const [selectOption, setSelectOption] = useState(0);

    const optionChanger = (e)=>{
        setSelectOption(Number(e.target.value))
        console.log(selectOption)
    }

    const userHandler = (e) => {

    }
  return (
    <div id='admin-attendance-container'>
        <AdminSidebar />
        <section className='admin-attendance-main'>
        <AdminHeader />
        {selectOption === 0 &&
        <>
            <section className='flex items-center gap-4 mb-16'>
                <div className='ml-4 text-2xl'>
                    <select value={selectOption} onChange={optionChanger} className='outline-none border rounded-md text-xl p-2 text-center'>
                        <option value={0}>일일근무 현황</option>
                        <option value={1}>주간근무 현황</option>
                        <option value={2}>월간근무 현황</option>
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
            <section className='mb-10'>
                <table className='w-full table-auto border-collapse mb-16'>
                    <thead className='bg-gray-100'>
                        <tr className='h-16 items-center'>
                            <th className='rounded-tl-lg'>홍길동</th>
                            <th className=''>이상훈</th>
                            <th className=''>전규찬</th>
                            <th className=''>전규창</th>
                            <th className=''>이상훈</th>
                            <th className='rounded-tr-lg'>홍상훈</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className='text-center h-16 items-center'>
                            <td className=''>휴가</td>
                            <td className=''>출근</td>
                            <td className=''>출근</td>
                            <td className=''>출근</td>
                            <td className=''>외근</td>
                            <td className=''>출근</td>
                        </tr>
                    </tbody>
                </table>
            </section>
            <section className='flex flex-col'>
                <h2 className='text-left ml-8'>일일 근태현황</h2>
                <div className='flex justify-around'>
                    <PieChartComponent/>
                    <PieChartComponent/>
                    <PieChartComponent/>
                </div>
            </section>
        </>
        }
        {selectOption === 1 &&
        <>
            <section className='flex items-center gap-4 mb-12'>
                <div className='ml-4 text-2xl'>
                    <select value={selectOption} onChange={optionChanger} className='outline-none border rounded-md text-xl p-2 text-center'>
                        <option value={0}>일일근무 현황</option>
                        <option value={1}>주간근무 현황</option>
                        <option value={2}>월간근무 현황</option>
                    </select>
                </div>
                <div className='ml-auto flex'>
                    <CustomSearch 
                        width1='40'
                        width2='72'
                    />
                </div>
                <select className='text-center opacity-80 w-24 h-10 outline-none border'>
                    <option>번호</option>
                    <option>담당업무</option>
                    <option>부서별</option>
                </select>
                <div>7 / 11</div>
            </section>
            <section>
                <table className='w-full'>
                    <thead className='bg-gray-100 h-16'>
                        <tr>
                            <th className='rounded-tl-lg'>이름</th>
                            <th>월</th>
                            <th>화</th>
                            <th>수</th>
                            <th>목</th>
                            <th>금</th>
                            <th className='rounded-tr-lg'>토</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className='text-center h-16'>
                            <td>이상훈</td>
                            <td>휴가</td>
                            <td>휴가</td>
                            <td>휴가</td>
                            <td>출장</td>
                            <td>출근</td>
                            <td>출근</td>
                        </tr>
                        <tr className='text-center h-16'>
                            <td>전규찬</td>
                            <td>휴가</td>
                            <td>휴가</td>
                            <td>휴가</td>
                            <td>출장</td>
                            <td>출근</td>
                            <td>출근</td>
                        </tr>
                        <tr className='text-center h-16'>
                            <td>박준우</td>
                            <td>휴가</td>
                            <td>휴가</td>
                            <td>휴가</td>
                            <td>출장</td>
                            <td>출근</td>
                            <td>출근</td>
                        </tr>
                        <tr className='text-center h-16'>
                            <td>신승우</td>
                            <td>결근</td>
                            <td>지각</td>
                            <td>결근</td>
                            <td>출근</td>
                            <td>결근</td>
                            <td>출근</td>
                        </tr>
                        <tr className='text-center h-16'>
                            <td>이상훈(96)</td>
                            <td>결근</td>
                            <td>지각</td>
                            <td>결근</td>
                            <td>출근</td>
                            <td>결근</td>
                            <td>출근</td>
                        </tr>
                    </tbody>
                </table>
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
        {selectOption === 2 &&
        <>
            <section className='flex items-center gap-4 mb-12'>
                <div className='ml-4 text-2xl'>
                    <select value={selectOption} onChange={optionChanger} className='outline-none border rounded-md text-xl p-2 text-center'>
                        <option value={0}>일일근무 현황</option>
                        <option value={1}>주간근무 현황</option>
                        <option value={2}>월간근무 현황</option>
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
                            <th className='rounded-tl-lg'>이름</th>
                            <th>01</th>
                            <th>02</th>
                            <th>03</th>
                            <th>04</th>
                            <th>05</th>
                            <th>06</th>
                            <th>07</th>
                            <th>08</th>
                            <th>09</th>
                            <th>10</th>
                            <th>11</th>
                            <th>12</th>
                            <th>13</th>
                            <th>14</th>
                            <th>15</th>
                            <th>16</th>
                            <th>17</th>
                            <th>18</th>
                            <th>19</th>
                            <th>20</th>
                            <th>21</th>
                            <th>22</th>
                            <th>23</th>
                            <th>24</th>
                            <th>25</th>
                            <th>26</th>
                            <th>27</th>
                            <th>28</th>
                            <th>29</th>
                            <th>30</th>
                            <th className='rounded-tr-lg'>31</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className='text-center h-16'>
                            <td>이상훈</td>
                            <td>o</td>
                            <td>x</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>x</td>
                            <td>x</td>
                            <td>x</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                        </tr>
                        <tr className='text-center h-16'>
                            <td>이상훈</td>
                            <td>o</td>
                            <td>x</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>x</td>
                            <td>x</td>
                            <td>x</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                        </tr>
                        <tr className='text-center h-16'>
                            <td>이상훈</td>
                            <td>o</td>
                            <td>x</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>x</td>
                            <td>x</td>
                            <td>x</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                        </tr>
                        <tr className='text-center h-16'>
                            <td>이상훈</td>
                            <td>o</td>
                            <td>x</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>x</td>
                            <td>x</td>
                            <td>x</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                        </tr>
                        <tr className='text-center h-16'>
                            <td>이상훈</td>
                            <td>o</td>
                            <td>x</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>x</td>
                            <td>x</td>
                            <td>x</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                            <td>o</td>
                        </tr>
                    </tbody>
                </table>
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
    </section>
    </div>
  )
}
