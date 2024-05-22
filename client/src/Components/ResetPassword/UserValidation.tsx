import React, { useState, useContext } from "react"
import { useAppDispatch } from "../../store/hooks"
import { fetchToApi } from "../../Api/fetch"
import { StableNavigateContext } from "../../App"
import { setUsername } from "../../store/counterSlice"

const UserValidation = () => {

    const dispatch = useAppDispatch()
    const nav = useContext(StableNavigateContext)
    const [user, setUser] = useState<string>('')
    const [error, setError] = useState<string | null>(null)

    const validateUser = async(e: React.FormEvent<HTMLFormElement> | React.MouseEvent): Promise<void> => {
        e.preventDefault()
        try{
            const res = await fetchToApi('users/validate', {username: user})
            if(res.ok){
                const username = await res.text()
                dispatch(setUsername(username))
                nav('/codevalidation')
            }
            else if(res.status === 401)
                setError('Username does not exist')
            else
                setError('Something went wrong, Please try again later.')

        }
        catch{
            setError('Something went wrong, Please try again later.')
        }
    }

    return (
        <div className="reset-password">
            <h1>Forgot Password</h1>
            <p className="reset-password-msg">Please enter the username you want to reset the password for.</p>
            <form onSubmit={validateUser}>
                <input type='text' value={user} onChange={e => setUser(e.target.value)} placeholder="Enter User" />
                {error && <p>{error}</p>}
                <button className={!error ? 'btn-without-error' : ''}>SEND</button>
            </form>
            <p>Remember your password? <span className="back-to-login" onClick={() => nav('/')}>Login</span></p>
        </div>
    )
}

export default UserValidation