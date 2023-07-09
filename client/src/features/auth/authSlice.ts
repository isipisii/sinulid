import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { User } from '../../types/types'

export interface IAuthState {
  user: User | null
  token: string | null
}

const initialState: IAuthState = {
  user: null,
  token: localStorage.getItem("token") || null
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    getToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
    getUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    }   
  },
})

export const { getToken, getUser } = authSlice.actions

export default authSlice.reducer