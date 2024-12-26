import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/services/axios.jsx'
import CustomAlert from './Alert';
const MyCalendar = ({
  height,
  width
}) => {
  const [alertType, setAlertType] = useState("");
  const [alertIsOpen , setAlertIsOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState("");

  const {data : calendarDate, isLoading : isLoadingCalendarDate, isError : isErrorCalendarDate} = useQuery({
    queryKey : ['calendar-date'],
    queryFn : async () => {
      try {
        const response = await axiosInstance.get(`/api/calendar`)
        return response.data
      } catch(err){
        return err
      }
    },
    enabled : true,
    refetchOnWindowFocus: false,  
    staleTime: 300000,  
    retry: false,
    cacheTime : 5 * 60 * 1000
  })
  
  if(isLoadingCalendarDate){
    return <p>로딩중입니다...</p>
  }

  if(isErrorCalendarDate){
    return <p>{calendarDate}</p>
  }

  return (
    <div style={{ width: `${width}`, margin: '0 auto' }}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={calendarDate}
        contentHeight={height}
        eventClick={(info) => {
          alert('Event: ' + info.event.title);
        }}
        eventRender={(info) => {
          info.el.classList.add('custom-class');
        }}
        selectable={true}
        editable={true}
        dragging={true}
      />
    </div>
  );
};

export default MyCalendar;