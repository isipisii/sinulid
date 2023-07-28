import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { User } from '../../types/types'

interface IAuthState {
  user: User | null
  token: string
}

const initialState: IAuthState = {
  user: null,
  token: localStorage.getItem("token") || ""
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload
    }   
  },
})

export const { setToken, setUser } = authSlice.actions

export default authSlice.reducer