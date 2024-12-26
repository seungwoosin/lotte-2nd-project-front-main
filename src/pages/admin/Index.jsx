import React, { useEffect, useRef, useState } from 'react'
import '@/pages/admin/Admin.scss'
import { AdminCard1 } from '../../components/admin/AdminCard1'
import {AdminCard2} from '../../components/admin/AdminCard2'
import adminProfile from '@/assets/admin-profile.png'
import { CustomButton } from '../../components/Button'

export default function AdminIndex() {
  const currentDate = new Date(); 
  const formattedDate = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul', 
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(currentDate);
  const timeRef = useRef(null);
  const dateParts = formattedDate.split('.');
  const finalDate = `${dateParts[0]} -${dateParts[1]} -${dateParts[2]}`;
  const [work,setWork] = useState(22)
  const [vacation,setVacation] = useState(3)
  const [outside,setOutside] = useState(5)
  useEffect(() => {
    const updateTime = () => {
      const currentDate = new Date();
      const currentTimeString = currentDate.getHours().toString().padStart(2, '0') + ':' +
        currentDate.getMinutes().toString().padStart(2, '0') + ':' +
        currentDate.getSeconds().toString().padStart(2, '0');
      
      timeRef.current.innerText = currentTimeString; // ref를 통해 DOM에 직접 접근하여 시간 업데이트

      setTimeout(updateTime, 1000);
    };

    updateTime(); // 컴포넌트 마운트 시 최초 시간 설정

    // 클린업 (컴포넌트 언마운트 시 setTimeout을 정리)
    return () => clearTimeout(updateTime);
  }, []);
  const userHandler = () => {

  }
  return (
    <div id='admin-index-container'>
      <section className='admin-index-top'>
        <article className='admin-index-top-left'>
          <div className='admin-index-top-project'>
            <AdminCard1 AdminCard1
              type="user"
              location="0"
            />
            <AdminCard1 
              type="project"
              location="0"
            />
            <AdminCard1 
              type="outsourcing"
              location="0"
            />
          </div>
        </article>
        <article className='admin-index-top-right'>
          <div className='admin-index-top-companyinfo'>
            <div className='companyinfo-left'>
              <p className='gray'>welcome OOO Company</p>
              <p style={{fontSize:'20px'}}>회사 설정</p>
            </div>
            <div className='companyinfo-right'>
              <img src={adminProfile}/>
            </div>
          </div>
          <div className='admin-index-top-attendance'>
            <div className='attendance-left'>
                <p ref={timeRef}></p>
                <CustomButton 
                  type='button'
                  handler={userHandler}
                  color="white"
                  bg="blue"
                  size="sm"
                  text="관리하기"
                  height="40px"
                />
            </div>
            <div className='attendance-right'>
                <CustomButton 
                  type='button'
                  handler={userHandler}
                  color="white"
                  bg="blue"
                  size="sm"
                  text={`근무중 : ${work}`}
                  height="50px"
                />
                <CustomButton 
                  type='button'
                  handler={userHandler}
                  color="white"
                  bg="blue"
                  size="sm"
                  text={`출타중 : ${outside}`}
                  height="50px"
                />
                <CustomButton 
                  type='button'
                  handler={userHandler}
                  color="white"
                  bg="blue"
                  size="sm"
                  text={`휴가중 : ${vacation}`}
                  height="50px"
                />
            </div>
          </div>
        </article>
      </section>
      <section className='admin-index-bot'>
        <AdminCard2 
          title="공지사항"
          location="0"
          type="info"
        />
        <AdminCard2 
          title="일정"
          location="0"
          type="schedule"
        />
        <AdminCard2 
          title={finalDate}
          location="0"
          type="calendar"
        />
        <AdminCard2 
          title="TO"
          location="0"
          type="to"
        />
      </section>
    </div>
  )
}
