import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './Components/Login/Login'
import SignUp from './Components/SignUp/SignUp'
import './App.css'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='signup' element={<SignUp />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
