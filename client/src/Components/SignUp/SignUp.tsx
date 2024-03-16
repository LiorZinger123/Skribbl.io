import { useContext } from 'react'
import { useAppDispatch } from '../../store/hooks'
import { StableNavigateContext } from '../../App'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignUpFormFields, schema } from '../../types/SignUpTypes/signUpFormFields'
import { fetchToApi } from '../../Api/fetch'
import { setUsername } from '../../store/counterSlice'
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock'
import MailIcon from '@mui/icons-material/Mail';
import LockOpenIcon from '@mui/icons-material/LockOpen';

const SignUp = () => {

    const dispatch = useAppDispatch()
    const nav = useContext(StableNavigateContext)
    const inputClassName = 'input-box signin-input input-space'
    const inputErrorClassName = 'input-box signin-input'
    const errorClassName = 'authorization-error signin-error'

    const { 
        register, 
        handleSubmit, 
        setError, 
        formState: { errors, isSubmitting } 
    } = useForm<SignUpFormFields>({ resolver: zodResolver(schema) })

    const onSubmit: SubmitHandler<SignUpFormFields> = async (data): Promise<void> => {
        try{
            if(data.password !== data.submitPassword)
                setError("submitPassword", { message: "Passwords do not match" })
            else{
                const {submitPassword, ...userInfo} = data
                const res = await fetchToApi('users/add', userInfo)
                if(res.status === 201){
                    dispatch(setUsername(await res.text()))
                    nav('/home')
                }
                else if(res.status === 403)
                    setError("root", { message: await res.text() })
                else
                    setError("root", { message: "Something went wrong, please try again later."})
            }
        }
        catch{
            setError("root", { message: "Something went wrong, please try again later."})
        }
    }

    return (
        <div className='authorization signin'>
             <form onSubmit={handleSubmit(onSubmit)}>
                <h1>Sign In</h1>

                <div className={!errors.username ? inputClassName : inputErrorClassName}>
                    <input {...register("username")} type='text' placeholder='Username' />
                    <PersonIcon className='icon signin-icon' />
                </div>
                {errors.username && <div className={errorClassName}>{errors.username.message}</div>}

                <div className={!errors.password ? inputClassName : inputErrorClassName}>
                    <input {...register("password")} type='password' placeholder='Password' />
                    <LockIcon className='icon signin-icon' />
                </div>
                {errors.password && <div className={errorClassName}>{errors.password.message}</div>}
                            
                <div className={!errors.submitPassword ? inputClassName : inputErrorClassName}>
                    <input {...register("submitPassword")} type='password' placeholder='Submit Password' />
                    <LockOpenIcon className='icon signin-icon' />
                </div>
                {errors.submitPassword && <div className={errorClassName}>{errors.submitPassword.message}</div>}

                <div className={(!errors.email && !errors.root) ? inputClassName : inputErrorClassName}>
                    <input {...register("email")} type='text' placeholder='Email' />
                    <MailIcon className='icon signin-icon' />
                </div>
                {errors.email && <div className={errorClassName}>{errors.email.message}</div>}

                {errors.root && <div className={errorClassName}>{errors.root.message}</div>}
                <button className='authorization-btn signin-btn' disabled={isSubmitting} type='submit'>
                    {isSubmitting ? "Loading..." : "Sign In"}
                </button>

                <p>Have an account already? <span className='link' onClick={() => nav('/')}>Login</span></p>

            </form>
        </div>
  )
}

export default SignUp