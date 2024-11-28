import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './LoginPage.jsx'
import Register from './Register.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Login></Login>
    </>
  )
}

export default App
