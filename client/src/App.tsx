import { Routes, Route, NavigateFunction } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useRef, createContext } from "react";
import Login from './Components/Login/Login'
import SignUp from './Components/SignUp/SignUp'
import Home from "./Components/Home/Home";
import './App.css'
import Room from "./Components/Room/Room";
import CreateRoom from "./Components/CreateRoom/CreateRoom";

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
        </Routes>
    </StableNavigateContext.Provider>  
  )
}

export default App
