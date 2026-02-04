import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  evidenceList: [],
  selectedEvidence: null,
  loading: false,
  error: null,
  totalCount: 0,
};

export const evidenceSlice = createSlice({
  name: 'evidence',
  initialState,
  reducers: {
    setEvidenceList: (state, action) => {
      state.evidenceList = action.payload;
    },
    setSelectedEvidence: (state, action) => {
      state.selectedEvidence = action.payload;
    },
    addEvidence: (state, action) => {
      state.evidenceList.push(action.payload);
      state.totalCount++;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setTotalCount: (state, action) => {
      state.totalCount = action.payload;
    },
  },
});

export const {
  setEvidenceList,
  setSelectedEvidence,
  addEvidence,
  setLoading,
  setError,
  setTotalCount,
} = evidenceSlice.actions;
export default evidenceSlice.reducer;