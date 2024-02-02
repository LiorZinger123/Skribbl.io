import { useContext } from 'react'
import { StableNavigateContext } from '../../App'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateRoomFormFields, schema } from "../../types/createRoomFormFields"
import { fetchToApi } from "../../Api/fetch"

const CreateRoom = () => {

  const players = Array.from({ length: 8 }, (_, k) => k + 3)
  const times = Array.from({ length: 16 }, (_, k) => 10 * (k + 3))
  const rounds = Array.from({ length: 10 }, (_, k) => k + 1)

  const nav = useContext(StableNavigateContext)

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
      const res = await fetchToApi('users/createroom', data)
      // room.current = await res.text()
      nav('/room')
    }
    catch{
      setError('root', {message: "Something went wrong, please try again later"})
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="name">Name:</label>
      <input {...register('name')} id='name' type="text" placeholder="Room Name" />

      <label htmlFor="password">Password:</label>
      <input {...register('password')} id='password' placeholder="Enter Password"/>

      <label htmlFor="players">Maximum Players:</label>
      <select id='players'>
        {players.map(player => (
          <option key={player}>{player}</option>
        ))}
      </select>

      <label htmlFor="time">Drawing Time:</label>
      <select id='time'>
        {times.map(time => (
          <option key={time}>{time}</option>
        ))}
      </select>
      
      <label htmlFor="rounds">Rounds:</label>
      <select id='rounds'>
        {rounds.map(round => (
          <option key={round}>{round}</option>
        ))}
      </select>
      
      <button type='submit' disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Room"}
      </button>

      <button type='button' onClick={() => nav('/home')}>Back</button>

      {errors.root && <div>{errors.root.message}</div>}
    </form>
  )
}

export default CreateRoom