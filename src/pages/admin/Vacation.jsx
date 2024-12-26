import React, { useState } from 'react'
import '@/pages/admin/Admin.scss'
import {CustomSearch} from '@/components/Search'
import { CustomButton } from '../../components/Button';
import MyCalendar from '../../components/Calendar';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { useSelector } from 'react-redux';

export default function AdminVacation() {
    const [team,setTeam] = useState(false);
    const [department,setDepartment] = useState(false);
    const openTeam = () => {setTeam(true)} 
    const closeTeam = () => {setTeam(false)}
    const openDepartment = () => {setDepartment(true)} 
    const closeDepartment = () => {setDepartment(false)}
    const selectedTeamId = useSelector((state) => state.team.selectedTeamId);
  return (
    <div id='admin-vacation-container'>
      <AdminSidebar />
      <section className='admin-vacation-main'>
        <section className='flex mb-16'>
            <p className='text-lg flex items-center justify-center w-80 rounded-md bg-gray-200 mx-auto'>{selectedTeamId}</p>
            <div className="flex"> 
                <img src='/images/dumy-profile.png' className="w-1/3" />
                <img src='/images/dumy-profile.png' className="w-1/3" />
                <img src='/images/dumy-profile.png' className="w-1/3" />
                <img src='/images/dumy-profile.png' className="w-1/3" />
            </div>
        </section>
        <section>
            <MyCalendar 
                height={580}
                width="65%"
            />
        </section>
      </section>
    </div>
  )
}
