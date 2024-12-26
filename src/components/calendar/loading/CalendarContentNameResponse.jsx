import React from 'react'

export default function CalendarContentNameResponse({calendarContentName}) {
  return (
    <>
        {
        calendarContentName.map((v) => {
            return (
            <li 
            key={v.id} 
            onClick={null} 
            data-status={v.status} 
            data-color={v.color}
            className={`mb-2 cursor-pointer w-full pl-[10px] text-${v.color}-200 hover:text-purple-700`}
            >• {v.stime} [ {v.name} ]
            </li>
            )
        })
        } 
    </>
  )
}
