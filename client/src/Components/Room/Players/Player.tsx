import FaceIcon from '@mui/icons-material/Face';
import Face2Icon from '@mui/icons-material/Face2';
import Face3Icon from '@mui/icons-material/Face3';
import Face4Icon from '@mui/icons-material/Face4';
import Face5Icon from '@mui/icons-material/Face5';
import Face6Icon from '@mui/icons-material/Face6';
import { PlayerType } from "../../../types/RoomTypes/types"

type Props = {
    player: PlayerType,
    location: number
}

const Player = (props: Props) => {
  
    const faces = [<FaceIcon />, <Face2Icon />, <Face3Icon />, <Face4Icon />, <Face5Icon />, <Face6Icon />]
    const face = faces[Math.floor(Math.random() * faces.length)]

    return (
    <li className='player'>
        <p className='player-location'>#{props.location}</p>
        <div className='player-details'>
            <div className='player-name'>{props.player.username}</div>
            <div>{props.player.score}</div>
        </div>
        {face}
    </li>
  )
}

export default Player