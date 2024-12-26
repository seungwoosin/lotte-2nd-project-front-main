import React, { useRef } from 'react'
import { CustomButton } from '../Button'

export const AdminCard2 = ({
    title,
    location,
    type,
    allTo = 40,
    progress = 14,
    radius = 50,
    strokeWidth = 10

}) => {
    const userHandler = () => {

    }
    const normalizedRadius = radius - strokeWidth / 2;
    const circumference = 2 * Math.PI * normalizedRadius;
    const toRef = useRef(null);
    const hoverTo = () => {
        toRef.current.style.display = 'block'
    }
    const outTo = () => {
        toRef.current.style.display = 'none'
    }
    
    // 비율에 맞는 stroke-dashoffset 계산
    const offset = circumference - (progress / allTo) * circumference; // 25는 최대값
  return (
    <div className='admin-card2'>
        <div className='admin-card2-1'>
            <span>{title}</span>
        </div>
        <div className='admin-card2-2'>
            {location==0 && type=='notice' &&
                <div>
                    노티스
                </div>
            }
            {location == 0 && type == 'info' &&
                <div>
                    공지사항
                </div>
            }
            {location == 0 && type == 'schedule' &&
                <div>
                    일정관리
                </div>
            }
            {location == 0 && type == 'calendar' &&
                <div>
                    달력
                </div>
            }
            {location ==0 && type=='to' &&
                <div onMouseOut={outTo} onMouseOver={hoverTo} className='admin-card2-circle'>
                    <svg width={radius * 2} height={radius * 2} className="progress-ring">
                    <circle
                        stroke="#e6e6e6" // 배경 원 색상
                        fill="transparent"
                        strokeWidth={strokeWidth}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                    <circle
                        stroke="blue" // 채워지는 색상
                        fill="transparent"
                        strokeWidth={strokeWidth}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                    />
                    </svg>
                    <span>남은 TO : {allTo-progress}
                    <p ref={toRef} style={{display:"none"}}>{progress +'/'+ allTo}</p>
                    </span>
                    
                </div>
            }
            {location==1 &&
                <div>
                    메인페이지용
                </div>
            }
        </div>
        <div className='admin-card2-3'>
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
    </div>
  )
}
