import { Fragment, useContext } from 'react'
import { StableNavigateContext } from '../../App'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateRoomFormFields, schema } from "../../types/CreateRoomTypes/createRoomFormFields"
import { fetchToApi } from "../../Api/fetch"
import { setRoomId } from '../../store/counterSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { RootState } from '../../store/store'

const CreateRoom = () => {

  const players = {id: 'players', label: 'Maximum Players', options: Array.from({ length: 8 }, (_, k) => k + 3)}
  const times = {id: 'time',label: 'Drawing Time', options: Array.from({ length: 16 }, (_, k) => 10 * (k + 3))}
  const rounds = {id: 'rounds', label: 'Rounds', options: Array.from({ length: 10 }, (_, k) => k + 1)}
  const createSettings = [players, times, rounds]
  let roomSettings = {players: '3', time: '30', rounds: '1'}

  const dispatch = useAppDispatch()
  const nav = useContext(StableNavigateContext)
  const username = useAppSelector((state: RootState) => state.username)

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
      const res = await fetchToApi('rooms/createroom', {username: username, ...roomSettings, ...data})
      dispatch(setRoomId(await res.text()))
      nav('/room')
    }
    catch{
      setError('root', {message: "Something went wrong, please try again later"})
    }
  }

  const updateRoomSettings = (id: string, data: string): void => {
    const key = id as keyof typeof roomSettings
    roomSettings[key] = data
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="name">Name:</label>
      <input {...register('name')} id='name' type="text" placeholder="Room Name" />

      <label htmlFor="password">Password:</label>
      <input {...register('password')} id='password' placeholder="Enter Password"/>

      {createSettings.map(setting => (
        <Fragment key={setting.id}>
          <label htmlFor={setting.id}>{setting.label}:</label>
          <select id={setting.id} onChange={(e) => updateRoomSettings(setting.id, e.target.value)}>
            {setting.options.map(item => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </Fragment>
      ))}
      
      <button type='submit' disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Room"}
      </button>

      <button type='button' onClick={() => nav('/home')}>Back</button>

      {errors.root && <div>{errors.root.message}</div>}
    </form>
  )
}

export default CreateRoom