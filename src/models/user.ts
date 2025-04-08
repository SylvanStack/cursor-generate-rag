import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { UserInfo, LoginParams } from '../interface/user';
import { login, getUserInfo } from '../services/user';

interface UserState {
  userInfo: UserInfo | null;
  token: string | null;
  loading: boolean;
  loginError: string | null;
}

const initialState: UserState = {
  userInfo: null,
  token: null,
  loading: false,
  loginError: null,
};

// 异步登录操作
export const loginAsync = createAsyncThunk(
  'user/login',
  async (params: LoginParams, { rejectWithValue }) => {
    try {
      const response = await login(params);
      if (response.status === 'error') {
        return rejectWithValue(response.message || '登录失败');
      }
      return response.data;
    } catch (error) {
      return rejectWithValue('登录请求失败');
    }
  }
);

// 异步获取用户信息
export const getUserInfoAsync = createAsyncThunk(
  'user/getUserInfo',
  async (_, { rejectWithValue }) => {
    try {
      return await getUserInfo();
    } catch (error) {
      return rejectWithValue('获取用户信息失败');
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.userInfo = null;
      state.token = null;
      state.loginError = null;
      // 可以在这里清除本地存储的token
      localStorage.removeItem('token');
    },
    clearLoginError: (state) => {
      state.loginError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.loginError = null;
      })
      .addCase(loginAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.userInfo = action.payload.userInfo;
        state.token = action.payload.token;
        // 保存token到本地存储
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.loginError = action.payload as string;
      })
      .addCase(getUserInfoAsync.fulfilled, (state, action: PayloadAction<UserInfo>) => {
        state.userInfo = action.payload;
      });
  },
});

export const { logout, clearLoginError } = userSlice.actions;

export default userSlice.reducer; 