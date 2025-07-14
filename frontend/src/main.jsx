import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import {Provider} from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import App from './App.jsx'
import reducers from './reducers/index.js'

const store = configureStore({
  reducer: reducers,       // This can be a combined reducer or a single one
});

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <StrictMode>
    <App />
  </StrictMode>
  </Provider>,
)