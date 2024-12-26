import { create } from "zustand";

const useUsersStore = create((set) => ({
  usersData: [],  // 초기값으로 빈 배열을 설정
  setUsersData: (data) => set({ usersData: data }),  // usersData를 업데이트하는 함수
}));



export const useAttendStore = create((set) => ({
  attendCount: 0, // 출근 카운트
  totalCount: 0,
  setAttendCount: (count) => set({ attendCount: count }), // 카운트를 설정하는 함수
  setTotalCount: (count) => set({ totalCount: count}),
}));

export const useCalenderNameStore = create((set) => ({
  calendarNames : [],
  setCalendarNames: (names) => set({calendarNames: names})
}));

export default useUsersStore;