import { useEffect, useState, useContext } from "react"
import { SocketContext } from "../Room"
import Canvas from "./Canvas/Canvas"
import ToolBar from "./ToolBar/ToolBar"

type Props = {
    setTime: React.Dispatch<React.SetStateAction<number>>,
    roundTime: React.MutableRefObject<number>,
    currentPainter: React.MutableRefObject<string>,
    canvasParentRef: React.MutableRefObject<HTMLDivElement | null>
}

const CanvasContainer = (props: Props) => {
  
    const socket = useContext(SocketContext)
    const [showTools, setShowTools] = useState<boolean>(false)
    const [currentColor, setCurrentColor] = useState<string>('#000000')
    const [drawLine, setDrawLine] = useState<boolean>(true)
    const [currentWidth, setCurrentWidth] = useState<number>(2)
    const [undo, setUndo] = useState<boolean>(false)
    const [deleteAll, setDeleteAll] = useState<boolean>(false)
    const [roomClosed, setRoomClosed] = useState<boolean>(false)

    useEffect(() => {

        const showToolBar = (): void => {
            setShowTools(true)
        }

        const closeToolBar = (): void => {
            setShowTools(false)
        }

        const disableTools = (): void => {
            setRoomClosed(true)
        }

        socket.on('start_draw', showToolBar)
        socket.on('end_turn', closeToolBar)
        socket.on('room_closed', disableTools)

        return (): void => {
            socket.off('start_draw', showToolBar)
            socket.off('end_turn', closeToolBar)
            socket.off('room_closed', disableTools)
        }
    })

    return (
        <>
            <Canvas setTime={props.setTime} roundTime={props.roundTime} currentColor={currentColor} drawLine={drawLine}
                currentWidth={currentWidth} setCurrentWidth={setCurrentWidth} deleteAll={deleteAll} undo={undo} setDeleteAll={setDeleteAll} 
                canvasParentRef={props.canvasParentRef} />
            {showTools && !roomClosed &&
                <ToolBar currentColor={currentColor} setCurrentColor={setCurrentColor} setDrawLine={setDrawLine}
                setCurrentWidth={setCurrentWidth} setDeleteAll={setDeleteAll} drawLine={drawLine} setUndo={setUndo} />
            }
        </>
    )
}

export default CanvasContainer