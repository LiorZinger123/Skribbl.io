import { useContext } from 'react'
import { StableNavigateContext } from '../../App'
import { SubmitHandler, useForm } from 'react-hook-form'
import { LoginFormFields, schema } from '../../types/loginFormFields'
import { fetchToApi } from '../../Api/fetch'
import { zodResolver } from '@hookform/resolvers/zod'

const Login = () => {

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
    const onSubmit: SubmitHandler<LoginFormFields> = async (data): Promise<void> => {
        try{
            const res = await fetchToApi('auth/login', data)
            if(res.ok){
                // username.current = await res.text()
                nav('home')
            }
            if(res.status === 401)
                setError("root", { message: "Username or password is incorrect" })
        }
        catch{
            setError("root", { message: "Something went wrong, please try again later."})
        }
    }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("username")} type='text' placeholder='Username' />
        <input {...register("password")} type='password' placeholder='Password' />
        <button disabled={isSubmitting} type='submit'>
            {isSubmitting ? "Loading..." : "Submit"}
        </button>
        <button type='button' onClick={() => nav('signup')}>Sign Up</button>
        {errors.root && <div>{errors.root.message}</div>}
    </form>
  )
}

export default Login