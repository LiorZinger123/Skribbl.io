import { useContext, useState } from 'react'
import { StableNavigateContext } from '../../App'
import { SubmitHandler, useForm } from 'react-hook-form'
import { LoginFormFields, schema } from '../../types/LoginTypes/loginFormFields'
import { fetchToApi } from '../../Api/fetch'
import { zodResolver } from '@hookform/resolvers/zod'
import { setUsername } from '../../store/counterSlice'
import { useAppDispatch } from '../../store/hooks'

const Login = () => {

    const dispatch = useAppDispatch()
    const nav = useContext(StableNavigateContext)
    const [type, setType] = useState<string>('password')
    
    const { 
        register, 
        handleSubmit, 
        setError, 
        formState: { errors, isSubmitting } 
    } = useForm<LoginFormFields>({
        resolver: zodResolver(schema)
    })
0
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
            setError("root", { message: "Something went wrong, please try again later."})
        }
    }

    const changeType = (): void => {
        if(type === 'password')
            setType('text')
        else
            setType('password')
    }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("username")} type='text' placeholder='Username' />
        <input {...register("password")} type={type} placeholder='Password' />
        <button type='button' onClick={changeType}>show/hide</button>
        <button disabled={isSubmitting} type='submit'>
            {isSubmitting ? "Loading..." : "Submit"}
        </button>
        <button type='button' onClick={() => nav('signup')}>Sign Up</button>
        {errors.root && <div>{errors.root.message}</div>}
    </form>
  )
}

export default Login