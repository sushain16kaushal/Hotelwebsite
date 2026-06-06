import { configureStore , combineReducers} from '@reduxjs/toolkit';
import bookingReducer from './bookingSlice';
import { persistStore, persistReducer,FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage use karta hai
import authReducer from './authSlice';
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['booking', 'auth'], 
};
const rootReducer = combineReducers({
  booking: bookingReducer,
  auth:authReducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },// redux-persist ke liye zaroori hai
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;