import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  isUpdated: false,
  isLoading: false,

  // ✅ MUST be null or string
  isError: null,

  isSweetAlert: false,
  isPageLoading: false,
  isOrderModalOpen: false,
  singleOrderDetails: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    /* ================= AUTH ================= */

    signInStart: (state) => {
      state.isLoading = true;
      state.isError = null; // ✅ reset error
    },

    loadingEnd: (state) => {
      state.isLoading = false;
    },

    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.isLoading = false;
      state.isError = null; // ✅ always clear error
    },

    signInFailure: (state, action) => {
      state.isLoading = false;

      // ✅ FORCE ERROR TO STRING
      if (typeof action.payload === "string") {
        state.isError = action.payload;
      } else if (action.payload?.message) {
        state.isError = action.payload.message;
      } else {
        state.isError = "Something went wrong";
      }
    },

    signOut: (state) => {
      state.currentUser = null;
      state.isLoading = false;
      state.isError = null;
    },

    /* ================= USER ================= */

    deleteUserStart: (state) => {
      state.isLoading = true;
      state.isError = null;
    },

    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.isLoading = false;
      state.isError = null;
    },

    deleteUserFailure: (state, action) => {
      state.isLoading = false;
      state.isError =
        typeof action.payload === "string"
          ? action.payload
          : action.payload?.message || "Delete failed";
    },

    editUserProfile: (state, action) => {
      if (!state.currentUser) return;

      const { username, email, phoneNumber, adress } = action.payload;
      state.currentUser.username = username;
      state.currentUser.email = email;
      state.currentUser.phoneNumber = phoneNumber;
      state.currentUser.adress = adress;
    },

    /* ================= UI FLAGS ================= */

    setUpdated: (state, action) => {
      state.isUpdated = action.payload;
    },

    setIsSweetAlert: (state, action) => {
      state.isSweetAlert = action.payload;
    },

    setPageLoading: (state, action) => {
      state.isPageLoading = action.payload;
    },

    setIsOrderModalOpen: (state, action) => {
      state.isOrderModalOpen = action.payload;
    },

    setSingleOrderDetails: (state, action) => {
      state.singleOrderDetails = action.payload;
    },
  },
});

export const {
  signInFailure,
  signInStart,
  signInSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOut,
  editUserProfile,
  setUpdated,
  loadingEnd,
  setIsSweetAlert,
  setPageLoading,
  setIsOrderModalOpen,
  setSingleOrderDetails,
} = userSlice.actions;

export default userSlice.reducer;
