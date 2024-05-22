import { Routes, Route, NavigateFunction } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useRef, createContext } from "react";
import Login from './Components/Login/Login'
import SignUp from './Components/SignUp/SignUp'
import Home from "./Components/Home/Home";
import Room from "./Components/Room/Room";
import CreateRoom from "./Components/CreateRoom/CreateRoom";
import UserValidation from "./Components/ResetPassword/UserValidation";
import CodeValidation from "./Components/ResetPassword/CodeValidation";
import ResetPassword from "./Components/ResetPassword/ResetPassword";
import './design/css'
import './App.css'

export const StableNavigateContext = createContext<NavigateFunction>(null!)

function App() {

  const nav = useNavigate()
  const navRef = useRef<NavigateFunction>(nav)

  return (
    <StableNavigateContext.Provider value={navRef.current}>
        <Routes>
            <Route path='/' element={<Login />} />
            <Route path='signup' element={<SignUp />} />
            <Route path='home' element={<Home />} />
            <Route path='room' element={<Room />} />
            <Route path='createroom' element={<CreateRoom />} />
            <Route path='forgotpass' element={<UserValidation />} />
            <Route path='codevalidation' element={<CodeValidation />} />
            <Route path='resetpassword' element={<ResetPassword />} />
        </Routes>
    </StableNavigateContext.Provider>  
  )
}

export default App
