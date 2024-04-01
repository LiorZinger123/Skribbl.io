import { useContext, useState, useRef } from 'react'
import { StableNavigateContext } from '../../App'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateRoomFormFields, schema } from "../../types/CreateRoomTypes/createRoomFormFields"
import { fetchToApi } from "../../Api/fetch"
import { setRoomId } from '../../store/counterSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { RootState } from '../../store/store'
import TokenError from '../TokenError/TokenError'
import CustomSelect from './CustomSelect'

const CreateRoom = () => {

  const dispatch = useAppDispatch()
  const nav = useContext(StableNavigateContext)
  const username = useAppSelector((state: RootState) => state.username)
  
  const [disablePass, setDisablePass] = useState<boolean>(true)
  const [showTokenError, setShowTokenError] = useState<boolean>(false)

  const players = {id: 'players', label: 'Maximum Players', options: Array.from({ length: 8 }, (_, k) => k + 3)}
  const times = {id: 'seconds',label: 'Drawing Time', options: Array.from({ length: 10 }, (_, k) => 10 * (k + 3))}
  const rounds = {id: 'rounds', label: 'Rounds', options: Array.from({ length: 10 }, (_, k) => k + 1)}
  const setPassword = {id: 'password', label: 'Password', options: ['No', 'Yes']}
  const createSettings = [players, times, rounds, setPassword]
  const roomSettings = useRef<any>({players: 3, seconds: 30, rounds: 1})

  const { 
        register, 
        handleSubmit, 
        setError, 
        formState: { errors, isSubmitting } 
    } = useForm<CreateRoomFormFields>({
        resolver: zodResolver(schema)
    })

  const onSubmit: SubmitHandler<CreateRoomFormFields> = async (data): Promise<void> => {
    try{
      const res = await fetchToApi('rooms/createroom', {username: username, ...roomSettings.current, ...data})
      if(res.ok){
        dispatch(setRoomId(await res.text()))
        nav('/room')
      }
      else if(res.status === 401)
        setShowTokenError(true)
0    }
    catch{
      setError('root', {message: "Something went wrong, please try again later"})
    }
  }

  const updateRoomSettings = (id: string, data: number): void => {
    const key = id as keyof typeof roomSettings
    roomSettings.current[key] = data
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className='create-room'>
      <h1>Create Room</h1>
      
      <div className='room-settings'>

        <div className='room-setting'>
            <label htmlFor="name">Name:</label>
            <input {...register('name')} id='name' className='name-input' type="text" placeholder="Room Name" />
            {errors.name && <div className='create-room-error'>Name must contain 3 characters!</div>}
        </div>

        {createSettings.map(setting => (
          <div key={setting.id} className='room-setting'>
            <label htmlFor={setting.id}>{setting.label}:</label>
            <CustomSelect setting={setting} updateRoomSettings={updateRoomSettings} setDisablePass={setDisablePass} />
          </div>
        ))}
        
        <div className='room-setting'>
          <label htmlFor="password">Set Password:</label>
          <input {...register('password')} id='pass' className={disablePass ? 'password-disabled' : 'password-enabled'}
            placeholder="Enter Password" disabled={disablePass} type='password' required />
          {errors.password && <div className='create-room-error'>Password must contain 3 characters!</div>}
        </div>

      </div>
  
      {errors.root && <div>{errors.root.message}</div>}

      <button type='submit' disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Room"}
      </button>

      <p>Dont want to create a room? <span className='link' onClick={() => nav('/home')}>JOIN ONE</span></p>

      {showTokenError && <TokenError />}
    </form>
  )
}

export default CreateRoom