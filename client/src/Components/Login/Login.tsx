import { useContext, useEffect } from 'react'
import { StableNavigateContext } from '../../App'
import { SubmitHandler, useForm } from 'react-hook-form'
import { LoginFormFields, schema } from '../../types/LoginTypes/loginFormFields'
import { fetchToApi, getFromApi } from '../../Api/fetch'
import { zodResolver } from '@hookform/resolvers/zod'
import { setUsername } from '../../store/counterSlice'
import { useAppDispatch } from '../../store/hooks'
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import { Checkbox, FormControlLabel } from '@mui/material'

const Login = () => {

    const dispatch = useAppDispatch()
    const nav = useContext(StableNavigateContext)
    
    const { 
        register, 
        handleSubmit, 
        setError, 
        formState: { errors, isSubmitting } 
    } = useForm<LoginFormFields>({
        resolver: zodResolver(schema)
    })
0
    useEffect(() => {
        const rememberMe = async (): Promise<void> => {
            try{
                const res = await getFromApi('auth/remember_me')
                if(res.ok){
                    dispatch(setUsername(await res.text()))
                    nav('home')
                }
            }
            catch(e){
                throw e
            }
        }

        rememberMe()
    }, [])

    const onSubmit: SubmitHandler<LoginFormFields> = async (data): Promise<void> => {
        try{
            const res = await fetchToApi('auth/login', data)
            if(res.ok){
                dispatch(setUsername(await res.text()))
                nav('home')
            }
            if(res.status === 401)
                setError("root", { message: "Username or password is incorrect" })
        }
        catch{
            setError("root", { message: "Something went wrong, please try again later." })
        }
    }

  return (
    <div className='authorization login'>
        <form onSubmit={handleSubmit(onSubmit)}>
            <h1>Login</h1>
            
            <div className='input-box input-space login-input'>
                <input {...register("username")} type='text' placeholder='Username'  />
                <PersonIcon className='icon login-icon' />
            </div>
            
            <div className='input-box login-input'>
                <input {...register("password")} type='password' placeholder='Password' />
                <LockIcon className='icon login-icon' />
            </div>
            
            {errors.root && <div className='authorization-error login-error'>{errors.root.message}</div>}
            
            <div className={`login-options ${!errors.root ? 'login-options-without-errors' : 'login-options-with-error'}`}>
                <FormControlLabel control={<Checkbox {...register("rememberMe")} 
                sx={{ color: "white", "&.Mui-checked": {color: "#DA56EF"} }} />} label="Remember Me" />
                <p className='forgot-password' onClick={() => nav('forgotpass')}>Forgot Password?</p>
            </div>
            
            <button className='authorization-btn login-btn' disabled={isSubmitting} type='submit'>
                {isSubmitting ? "Loading..." : "Login"}
            </button>
            <p>Dont have an account? <span className='link' onClick={() => nav('signup')}>Register</span></p>
        </form>
    </div>
  )
}

export default Login