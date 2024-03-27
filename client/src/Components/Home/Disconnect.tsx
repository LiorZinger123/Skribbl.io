import { useContext } from 'react'
import { StableNavigateContext } from '../../App'
import Cookies from 'js-cookie'

const Disconnect = () => {
    
    const nav = useContext(StableNavigateContext)

    const handleDisconnect = (): void => { //delete username
        Cookies.remove("Login")
        nav('/')
    }

    return (
        <>
            <a className='disconnect-link' onClick={handleDisconnect}>Disconnect</a>
        </>
    )
}

export default Disconnect