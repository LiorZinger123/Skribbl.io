import { useState, useContext } from "react"
import { StableNavigateContext } from "../../App"
import { fetchToApi } from "../../Api/fetch"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from 'react-hook-form'
import { ResetPasswordFormFields, schema } from "../../types/ResetPassword/ResetPasswordFormFields"
import ResetPassTokenError from "./ResetPassTokenError"

const ResetPassword = () => {

    const nav = useContext(StableNavigateContext)
    const [showTokenError, setShowTokenError] = useState<boolean>(false)

    const { 
        register, 
        handleSubmit, 
        setError, 
        formState: { errors } 
    } = useForm<ResetPasswordFormFields>({ resolver: zodResolver(schema) })

    const onSubmit: SubmitHandler<ResetPasswordFormFields> =  async(data): Promise<void> => {
        try{
            if(data.password !== data.submitPassword)
                setError('root', {message: 'Passwords do not match'})
            else{
                const res = await fetchToApi('users/reset_pass', {password: data.password, submitPassword: data.submitPassword})
                if(res.ok)
                    nav('/')
                else if(res.status === 400)
                    setError('root', {message: 'Passwords do not match'})
                else if(res.status === 401)
                    setShowTokenError(true)
                else if(res.status === 409)
                    setError('root', {message: 'The new password is the same as the existing password. Please try another password'})
                else
                    setError('root', {message: 'Something went wrong, please try again later.'})
            }
        }
        catch{
            setError('root', {message: 'Something went wrong, please try again later.'})
        }
    }

  return (
    <>
        {!showTokenError && 
            <div className="reset-password">
                <h1>Reset Password</h1>
                <p className="reset-password-msg">Please enter your new password. You have 5 minutes to reset your password!</p>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input {...register('password')} type='password' placeholder="New Password" className="new-password-input" />
                    {errors.password && <div className="new-password-error">{errors.password.message}</div>}

                    <input {...register('submitPassword')} type='password' placeholder="Submit New Password" />
                    
                    {errors.root && <div className="submit-password-error">{errors.root.message}</div>}
                    <button className={!errors.root ? 'btn-without-error' : ''}>SEND</button>
                </form>
                <p>Remember your password? <span className="back-to-login" onClick={() => nav('/')}>Login</span></p>
            </div> 
        }
        {showTokenError && <ResetPassTokenError />}
    </>
  )
}

export default ResetPassword