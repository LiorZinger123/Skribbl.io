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
    const classname = 'input-box signin-input input-space'
    const errorClassName = 'input-box signin-input'

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

                <div className={!errors.username ? classname : errorClassName}>
                    <input {...register("username")} type='text' placeholder='Username' />
                    <PersonIcon className='icon' />
                </div>
                {errors.username && <div className='authorization-error'>{errors.username.message}</div>}

                <div className={!errors.password ? classname : errorClassName}>
                    <input {...register("password")} type='password' placeholder='Password' />
                    <LockIcon className='icon' />
                </div>
                {errors.password && <div className='authorization-error'>{errors.password.message}</div>}
                            
                <div className={!errors.submitPassword ? classname : errorClassName}>
                    <input {...register("submitPassword")} type='password' placeholder='Submit Password' />
                    <LockOpenIcon className='icon' />
                </div>
                {errors.submitPassword && <div className='authorization-error'>{errors.submitPassword.message}</div>}

                <div className={(!errors.email && !errors.root) ? classname : errorClassName}>
                    <input {...register("email")} type='text' placeholder='Email' />
                    <MailIcon className='icon' />
                </div>
                {errors.email && <div className='authorization-error'>{errors.email.message}</div>}

                {errors.root && <div className='authorization-error'>{errors.root.message}</div>}
                <button className='authorization-btn signin-btn' disabled={isSubmitting} type='submit'>
                    {isSubmitting ? "Loading..." : "Sign In"}
                </button>

                <button className='authorization-btn signin-btn' type='button' onClick={() => nav('/')}>Login</button>

            </form>
        </div>
  )
}

export default SignUp