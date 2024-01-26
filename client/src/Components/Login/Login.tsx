import React, { useState } from "react"
import UserLogin from "../../types/userLogin"
import { connect } from "../../Api/fetchFunctions"

const Login = () => {
    
    const [data, setData] = useState<UserLogin>({ username: '', password: '' })
    const [msg, setMsg] = useState<string>('')

    const handleConnect = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        try{
            e.preventDefault()
            const res = await connect('auth/login', data)
            if(res.ok)
                console.log("Connect!")
            if(res.status === 400)
                setMsg("Username or password is incorrect")
        }
        catch{
            setMsg("Something went wrong. Please try again later.")
        }
    }

    return (
    <div>
        <form onSubmit={handleConnect}>
            <input type='text' name='username' value={data.username} onChange={(e) => setData({...data, username: e.target.value})}
            placeholder="Username" required />

            <input type='password' name='password' value={data.password} onChange={(e) => setData({...data, password: e.target.value})}
            placeholder="Password" required />

            <button>Login</button>
        </form>
        <p>{msg}</p>
    </div>
  )
}

export default Login