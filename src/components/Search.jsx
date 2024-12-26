import React from 'react'

export const CustomSearch = ({
    width1,
    width2
}) => {
  return (
    <label className={`flex justify-start items-center border rounded-r-md w-${width2} h-11`}>
        <img className='opacity-50 w-6 h-6 ml-4' src='/images/search-icon.png' />
        <input className={`pl-4 w-${width1} text-sm text-center`} placeholder='검색하기'/>
    </label>
  )
}
