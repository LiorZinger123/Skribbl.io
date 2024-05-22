import { useState, useContext } from "react"
import { fetchToApi } from "../../Api/fetch"
import { StableNavigateContext } from "../../App"
import { useAppSelector } from "../../store/hooks"
import { RootState } from "../../store/store"
import ResetPassTokenError from "./ResetPassTokenError"

const CodeValidation = () => {

    const nav = useContext(StableNavigateContext)
    const username = useAppSelector((state: RootState) => state.username)
    const [code, setCode] = useState<string>('')
    const [error, setError] = useState<string | null>(null)
    const [showTokenError, setShowTokenError] = useState<boolean>(false)

    const verifyCode = async(e: React.FormEvent<HTMLFormElement> | React.MouseEvent): Promise<void> => {
        try{
            e.preventDefault()
            const res = await fetchToApi('users/verify', {username: username, code: code})
            if(res.ok)
                nav('/resetpassword')
            else if(res.status === 401){
                const msg = await res.text()
                if(msg === 'wrong')
                    setError('Code is incorrect')
                else
                    setShowTokenError(true)
            }
        }
        catch{
            setError('Something went wrong, Please try again later.')
        }
    } 

  return (
    <>
        {!showTokenError &&
            <div className="reset-password">
                <h1>Code Validation</h1>
                <p className="reset-password-msg">A verification code was sent to your email. You have 2 minutes to enter the code!</p>
                <form onSubmit={verifyCode}>
                    <input type='text' value={code} onChange={e => setCode(e.target.value)} placeholder="Validation Code" />
                    {error && <p>{error}</p>}
                    <button className={!error ? 'btn-without-error' : ''}>SEND</button>
                </form>
                <p>Remember your password? <span className="back-to-login" onClick={() => nav('/')}>Login</span></p>
            </div>
        }
        {showTokenError && <ResetPassTokenError />}
    </>
  )
}

export default CodeValidation