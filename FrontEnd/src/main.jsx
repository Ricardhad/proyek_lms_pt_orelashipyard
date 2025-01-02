import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'; // Import Provider
import store from './redux/store'; // Adjust the path to where your store is located

import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}> {/* Wrap App with Provider */}
      <App />
    </Provider>
  </React.StrictMode>,
  // document.getElementById('root')
)
