import { useContext } from 'react'
import { StableNavigateContext } from '../../App'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignUpFormFields, schema } from '../../types/signUpFormFields'
import { fetchToApi } from '../../Api/fetch'

const SignUp = () => {

    const nav = useContext(StableNavigateContext)

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
                    // username.current = await res.text()
                    nav('/home')
                }
                if(res.status === 403)
                    setError("root", { message: await res.text() })
            }
        }
        catch{
            setError("root", { message: "Something went wrong, please try again later."})
        }
    }

    return (
    <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("username")} type='text' placeholder='Username' />
        {errors.username && <div>{errors.username.message}</div>}

        <input {...register("password")} type='password' placeholder='Password' />
        {errors.password && <div>{errors.password.message}</div>}
        
        <input {...register("submitPassword")} type='password' placeholder='Submit Password' />
        {errors.submitPassword && <div>{errors.submitPassword.message}</div>}
        
        <input {...register("email")} type='text' placeholder='Email' />
        {errors.email && <div>{errors.email.message}</div>}

        <button disabled={isSubmitting} type='submit'>
            {isSubmitting ? "Loading..." : "Submit"}
        </button>

        <button type='button' onClick={() => nav('/')}>Login</button>

        {errors.root && <div>{errors.root.message}</div>}
    </form>
  )
}

export default SignUp