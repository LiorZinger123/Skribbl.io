import { useState } from "react"
import { useAppSelector } from "../../../store/hooks"
import { RootState } from "../../../store/store"
import Canvas from "./Canvas/Canvas"
import ToolBar from "./ToolBar/ToolBar"
import { PlayerType } from "../../../types/RoomTypes/types"

type Props = {
    players: PlayerType[],
    setTime: React.Dispatch<React.SetStateAction<number>>,
    roundTime: React.MutableRefObject<number>,
    currentPainter: React.MutableRefObject<string>
}

const CanvasContainer = (props: Props) => {
  
    const username = useAppSelector((state: RootState) => state.username)
    const [currentColor, setCurrentColor] = useState<string>('#000000')
    const [drawLine, setDrawLine] = useState<boolean>(true)
    const [currentWidth, setCurrentWidth] = useState<number>(5)
    const [undo, setUndo] = useState<boolean>(false)
    const [deleteAll, setDeleteAll] = useState<boolean>(false)

    return (
        <div>
            <Canvas players={props.players} setTime={props.setTime} roundTime={props.roundTime} currentColor={currentColor} drawLine={drawLine}
                currentWidth={currentWidth} setCurrentWidth={setCurrentWidth} deleteAll={deleteAll} undo={undo} setDeleteAll={setDeleteAll} />
            {props.currentPainter.current === username && 
                <ToolBar currentColor={currentColor} setCurrentColor={setCurrentColor} setDrawLine={setDrawLine}
                setCurrentWidth={setCurrentWidth} setDeleteAll={setDeleteAll} drawLine={drawLine} deleteAll={deleteAll} setUndo={setUndo} />
            }
        </div>
    )
}

export default CanvasContainer