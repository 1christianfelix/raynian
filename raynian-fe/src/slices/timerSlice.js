import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  totalStudyTimeMins: 0,
  countdown: {
    hours: 0,
    minutes: 60,
    seconds: 0,
  },
  workTime: {
    hours: 0,
    minutes: 60,
    seconds: 0,
  },
  breakTime: {
    hours: 0,
    minutes: 15,
    seconds: 0,
  },
  isRunning: false,
  isWork: true,
  isBreak: false,
  isPaused: false,
  sessionStreak: 0,
  sessionsCompleted: 0,
  syncedWithRoom: false,
  autoStart: false,
  longBreakFrequency: 3,
  longBreakTime: {
    hours: 0,
    minutes: 30,
    seconds: 0,
  },
  sessionElapsedTime: 0,
};

const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    setTotalStudyTimeMins: (state, action) => {
      state.totalStudyTimeMins = action.payload;
    },
    updateCountdown: (state, action) => {
      state.countdown = action.payload;
    },

    setIsWork: (state, action) => {
      state.isWork = action.payload;
    },
    setIsBreak: (state, action) => {
      state.isBreak = action.payload;
    },
    setIsRunning: (state, action) => {
      state.isRunning = action.payload;
    },
    setIsPaused: (state, action) => {
      state.isPaused = action.payload;
    },
    setWorkTime: (state, action) => {
      state.workTime = action.payload;
    },
    setBreakTime: (state, action) => {
      state.breakTime = action.payload;
    },
    setLongBreakTime: (state, action) => {
      state.longBreakTime = action.payload;
    },
    setLongBreakFrequency: (state, action) => {
      state.longBreakFrequency = action.payload;
    },
    setAutoStart: (state, action) => {
      state.autoStart = action.payload;
    },
    resetSessionStreak: (state) => {
      state.sessionStreak = 0;
    },
    decrementCountdown: (state) => {
      const { hours, minutes, seconds } = state.countdown;
      if (state.isWork) {
        state.sessionElapsedTime += 1;
      }
      // if (state.sessionElapsedTime != 0 && state.sessionElapsedTime % 60 == 0) {
      //   state.totalStudyTimeMins += 1;
      // }
      if (hours <= 0 && minutes === 0 && seconds === 0) {
        if (state.isWork == true) {
          state.isBreak = true;
          state.isWork = false;
          state.sessionsCompleted += 1;
          state.sessionStreak =
            state.workTime.minutes >= 30 ? state.sessionStreak + 1 : 0;
          state.countdown =
            state.longBreakFrequency == state.sessionStreak
              ? state.longBreakTime
              : state.breakTime;
          return;
        } else {
          state.isBreak = false;
          state.isWork = true;
          state.countdown = state.workTime;
          state.isRunning = state.autoStart ? true : false;
          return;
        }
      }

      if (minutes === 0 && seconds === 0) {
        state.countdown = {
          hours: hours - 1,
          minutes: 59,
          seconds: 59,
        };
      } else if (seconds === 0) {
        state.countdown = {
          hours,
          minutes: minutes - 1,
          seconds: 59,
        };
      } else {
        state.countdown = {
          hours,
          minutes,
          seconds: seconds - 1,
        };
      }
    },
  },
});

export const startTimer = () => async (dispatch, getState) => {
  const state = getState().timer;
  console.log("startTimer");
  const { isRunning } = state;
  if (!isRunning) {
    dispatch(setIsRunning(true));
    dispatch(setIsPaused(false));
  }
};

export const stopTimer = () => async (dispatch, getState) => {
  console.log("stopTimer");
  const state = getState().timer;
  const { isWork, isBreak, workTime, breakTime, sessionsCompleted } = state;
  updateCountdown({ ...workTime });
  if (isBreak) {
    dispatch(setIsBreak(false));
    dispatch(setIsWork(true));
  }
  if (isWork) {
    dispatch(resetSessionStreak());
  }
  dispatch(setIsRunning(false));
  dispatch(setIsPaused(false));
};

export const pauseTimer = () => async (dispatch, getState) => {
  console.log("pauseTimer");
  const state = getState().timer;
  dispatch(setIsPaused(true));
  dispatch(setIsRunning(false));
};

export const getTimerState = () => async (dispatch, getState) => {
  const state = getState().timer;
  return state;
};

export const {
  setTotalStudyTimeMins,
  updateCountdown,
  setIsWork,
  setIsBreak,
  setIsRunning,
  setIsPaused,
  setWorkTime,
  setBreakTime,
  setLongBreakTime,
  setLongBreakFrequency,
  setAutoStart,
  resetSessionStreak,
  decrementCountdown,
} = timerSlice.actions;
export default timerSlice.reducer;
