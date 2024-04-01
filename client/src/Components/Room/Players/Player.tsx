import { useMemo } from "react";
import { useAppSelector } from "../../../store/hooks";
import { RootState } from "../../../store/store";
import { PlayerType } from "../../../types/RoomTypes/types"
import FaceIcon from '@mui/icons-material/Face';
import Face2Icon from '@mui/icons-material/Face2';
import Face3Icon from '@mui/icons-material/Face3';
import Face4Icon from '@mui/icons-material/Face4';
import Face5Icon from '@mui/icons-material/Face5';
import Face6Icon from '@mui/icons-material/Face6';
import { FaCrown } from "react-icons/fa6";

type Props = {
    player: PlayerType,
    index: number,
    location: number
}

const Player = (props: Props) => {
  
    const username = useAppSelector((state: RootState) => state.username)
    const faces = [<FaceIcon />, <Face2Icon />, <Face3Icon />, <Face4Icon />, <Face5Icon />, <Face6Icon />]
    const face =  useMemo(() => faces[Math.floor(Math.random() * faces.length)], [])
    const isOwner = props.player.username === username

    return (
        <li className={`player ${props.index % 2 === 0 && 'player-dark'}`}>

            <p className='player-location'>#{props.location}</p>
            
            <div className='player-details'>
                <div className='player-name'>{props.player.username} {isOwner && '(YOU)'}</div>
                <div>Points: {props.player.score}</div>
            </div>
            
            <div className="player-icon">
                {props.player.roomOwner && <FaCrown />}
                {face}
            </div>
            
        </li>
    )
}

export default Player