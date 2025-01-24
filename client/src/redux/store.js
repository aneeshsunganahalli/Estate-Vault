import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice.js'
import { persistReducer,persistStore} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import darkModeReducer from './darkMode/darkModeSlice.js'


const rootReducer = combineReducers({user: userReducer, darkMode: darkModeReducer})

const persistConfig = {
  key: 'root', 
  storage,
  version: 1,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false
  })
})

export const persistor = persistStore(store);