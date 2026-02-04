import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userList: [],
  loading: false,
  error: null,
};

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUserList: (state, action) => {
      state.userList = action.payload;
    },
    addUser: (state, action) => {
      state.userList.push(action.payload);
    },
    removeUser: (state, action) => {
      state.userList = state.userList.filter(user => user.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setUserList, addUser, removeUser, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;