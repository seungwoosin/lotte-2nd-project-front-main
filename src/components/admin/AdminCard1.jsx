import React from 'react'
import '@/components/admin/AdminCard.scss'
import { CustomButton } from '../Button'

export const AdminCard1 = ({
    type,
    location
}) => {


    const userHandler = () => {

    }

  return (
    <div className='admin-card1'>
        <div className='admin-card1-1'>
            <span>Nov, 16, 2024</span>
        </div>
        {type == 'user' &&
        <div className='admin-card1-2'>
            <span>인사 관리</span>
        </div>  

        } 
        {type == 'project' &&
        <div className='admin-card1-2'>
            <span>업무 분담</span>
        </div>  
        }
        {type == 'outsourcing' &&
        <div className='admin-card1-2'>
            <span>외주업체 관리</span>
        </div>  
        }
        <div className='admin-card1-3'>
            {location==0 &&
                <div>
                    어드민용
                </div>
            }
            {location==1 &&
                <div>
                    메인페이지용
                </div>
            }
        </div>
        <div className='admin-card1-4'>
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
