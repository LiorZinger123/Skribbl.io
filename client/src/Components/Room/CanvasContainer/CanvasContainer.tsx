import { useState } from "react"
import Canvas from "./Canvas/Canvas"
import ToolBar from "./ToolBar/ToolBar"
import { PlayerType } from "../../../types/RoomTypes/types"

type Props = {
    players: PlayerType[],
    setTime: React.Dispatch<React.SetStateAction<number>>,
    roundTime: React.MutableRefObject<number>
}

const CanvasContainer = (props: Props) => {
  
    const [currentColor, setCurrentColor] = useState<string>('#000000')
    const [drawLine, setDrawLine] = useState<boolean>(true)
    const [currentWidth, setCurrentWidth] = useState<number>(5)
    const [deleteAll, setDeleteAll] = useState<boolean>(false)

    return (
        <div>
            <Canvas players={props.players} setTime={props.setTime} roundTime={props.roundTime} currentColor={currentColor}
                drawLine={drawLine} currentWidth={currentWidth} setCurrentWidth={setCurrentWidth} deleteAll={deleteAll} />
            <ToolBar currentColor={currentColor} setCurrentColor={setCurrentColor} setDrawLine={setDrawLine}
            setCurrentWidth={setCurrentWidth} setDeleteAll={setDeleteAll} />
        </div>
    )
}

export default CanvasContainer