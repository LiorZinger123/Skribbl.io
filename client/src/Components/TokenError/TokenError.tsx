import { useContext } from 'react';
import { StableNavigateContext } from '../../App'
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

const TokenError = () => {

  const nav = useContext(StableNavigateContext)

  return (
    <div className="sliding-msg token-error">
        <SentimentVeryDissatisfiedIcon className='sliding-msg-icon token-error-icon' fontSize='large' />
        <p>You seem to be online for a long time.</p>
        <p>Please connect again.</p>
        <button className='token-error-btn' onClick={() => nav('/')}>Press Here To Login</button>
    </div>
  )
}

export default TokenError