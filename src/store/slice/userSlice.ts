import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { TUser } from "@/types/user";
import { signOut } from "@/auth";
import { getUserAction, setUserAction, signOutAction } from "@/actions/auth";
// import { ProfileImgUpload, deleteProfileImage } from "@/actions/file";

interface UserState {
  userData: TUser | null;
  loading: boolean;
  error: string | null;
  profileImg: string | null;
}

const initialState: UserState = {
  userData: null,
  loading: false,
  error: null,
  profileImg: null
};

export const getUserById = createAsyncThunk<TUser, string, { rejectValue: string }>("user/getUserById", async (userId, thunkAPI) => {
  try {
    const response = await getUserAction(userId);
    if (response?.success && response.data) {
      return response.data;
    }
    return thunkAPI.rejectWithValue(response?.error ?? `Failed to fetch user data!`);
  } catch (error) {
    return thunkAPI.rejectWithValue("An unexpected error occurred!");
  }
});

export const editUser = createAsyncThunk<TUser, Partial<TUser> & { id: string }, { rejectValue: string }>(
  "user/updateUser",
  async (user, thunkAPI) => {
    try {
      const response = await setUserAction(user);
      if (response?.success && response.data) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response?.error ?? `Failed to fetch user data!`);
    } catch (error) {
      return thunkAPI.rejectWithValue("An unexpected error occurred!");
    }
  }
);

export const logout = createAsyncThunk("user/logout", async (_, thunkAPI) => {
  try {
    await signOutAction();
    console.log("TEST") // Assuming signOut returns a promise
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Failed to log out.");
  }
});


const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // logout(state) {
    //   console.log("User is logging out")
    //   signOut();
    //   console.log("User logged out")
    //   state.userData = null;
    //   state.error = null;
    //   state.loading = true;
    // },
  },
  extraReducers: builder => {
    builder
      .addCase(getUserById.pending, state => {
        state.loading = true;
        state.error = null;
        state.userData = null;
      })
      .addCase(getUserById.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.loading = false;
        state.userData = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed.";
      })
      .addCase(editUser.pending, state => {
        state.loading = true;
        state.error = null;
        state.userData = null;
      })
      .addCase(editUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.userData = action.payload;
        state.loading = false;
      })
      .addCase(editUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.userData = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to log out.";
      });


  },

});
// export const { logout } = userSlice.actions;

export default userSlice.reducer;
