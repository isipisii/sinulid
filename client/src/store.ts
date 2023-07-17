import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from './features/auth/authSlice'
import { api } from './services/api'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import { postSlice } from './features/post/postSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    post: postSlice.reducer,
    [api.reducerPath]: api.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
})

setupListeners(store.dispatch)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch