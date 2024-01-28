import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './Components/Login/Login'
import SignUp from './Components/SignUp/SignUp'
import Home from "./Components/Home/Home";
import './App.css'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='signup' element={<SignUp />} />
          <Route path='home' element={<Home />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
