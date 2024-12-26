const initialState = {
    leader: false,
    task: false,
    progress: false,
    outsourcing: false,
    vacation: false,
  };
  
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case OPEN_LEADER:
        return { ...state, leader: true };
      case CLOSE_LEADER:
        return { ...state, leader: false };
  
      case OPEN_TASK:
        return { ...state, task: true };
      case CLOSE_TASK:
        return { ...state, task: false };
  
      case OPEN_PROGRESS:
        return { ...state, progress: true };
      case CLOSE_PROGRESS:
        return { ...state, progress: false };
  
      case OPEN_OUTSOURCING:
        return { ...state, outsourcing: true };
      case CLOSE_OUTSOURCING:
        return { ...state, outsourcing: false };
  
      case OPEN_VACATION:
        return { ...state, vacation: true };
      case CLOSE_VACATION:
        return { ...state, vacation: false };
  
      default:
        return state;
    }
  };