import { configureStore, createSlice } from '@reduxjs/toolkit';

// 초기 상태 설정
const initialState = {
  selectedTeamId: null,  // 팀 id 상태
};

// createSlice를 사용하여 액션과 리듀서를 자동으로 생성
const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    setSelectedTeamId: (state, action) => {
      state.selectedTeamId = action.payload;  // 클릭한 팀 id 저장
    },
  },
});

// 리덕스 스토어 생성
const store = configureStore({
  reducer: {
    team: teamSlice.reducer,  // 팀 상태 관리
  },
});

// 액션 생성자 export
export const { setSelectedTeamId } = teamSlice.actions;

export default store;
