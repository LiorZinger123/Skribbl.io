import { useContext, useEffect, useState } from "react"
import { StableNavigateContext } from "../../App"
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied"

const ResetPassTokenError = () => {

    const nav = useContext(StableNavigateContext)
    const [time, setTime] = useState<number>(10)

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(time => time - 1)
        }, 1000)

        const timeoutId = setTimeout(() => {
            nav('/')
        }, 1000 * 10)

        return (): void => {
            clearInterval(intervalId)
            clearTimeout(timeoutId)
        }
    }, [])

  return (
    <div className="sliding-msg token-error">
        <SentimentVeryDissatisfiedIcon className='sliding-msg-icon token-error-icon' fontSize='large' />
        <p>Your request exceeded the time limit or you did not validate your user.</p>
        <p>You will be return to the login page in {time} seconds.</p>
        <button className='token-error-btn' onClick={() => nav('/')}>Login</button>
    </div>
  )
}

export default ResetPassTokenError