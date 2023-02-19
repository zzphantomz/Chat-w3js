import { configureStore } from '@reduxjs/toolkit'
import {TypedUseSelectorHook, useDispatch as useReduxDispatch, useSelector as useReduxSelector} from 'react-redux';
import accountReducer from "@/slice/accountSlice";
export const store = configureStore({
  reducer: {
    account: accountReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})
export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;

export const useDispatch = () => useReduxDispatch<AppDispatch>();
