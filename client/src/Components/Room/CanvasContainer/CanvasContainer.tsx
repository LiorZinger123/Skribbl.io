import { useEffect, useState, useContext, createContext } from "react"
import { RoomContext } from "../Room"
import Canvas from "./Canvas/Canvas"
import ToolBar from "./ToolBar/ToolBar"
import { CanvasContextType, ToolBarContextType } from "../../../types/RoomTypes/contextsTypes"

type Props = {
    setTime: React.Dispatch<React.SetStateAction<number>>,
    turnTime: React.MutableRefObject<number>,
    canvasParentRef: React.MutableRefObject<HTMLDivElement | null>
}

export const CanvasContext = createContext<CanvasContextType>(null!)
export const ToolBarContext = createContext<ToolBarContextType>(null!)

const CanvasContainer = (props: Props) => {
  
    const socket = useContext(RoomContext).socket
    const [showTools, setShowTools] = useState<boolean>(false)
    const [currentColor, setCurrentColor] = useState<string>('#000000')
    const [drawLine, setDrawLine] = useState<boolean>(true)
    const [currentWidth, setCurrentWidth] = useState<number>(2)
    const [undo, setUndo] = useState<boolean>(false)
    const [deleteAll, setDeleteAll] = useState<boolean>(false)
    const [roomClosed, setRoomClosed] = useState<boolean>(false)

    const canvasContextValues = {...props, currentColor: currentColor, drawLine: drawLine, currentWidth: currentWidth, 
        setCurrentWidth: setCurrentWidth, deleteAll: deleteAll, setDeleteAll: setDeleteAll, undo: undo}
    const toolbarValues = {currentColor: currentColor, setCurrentColor: setCurrentColor, drawLine: drawLine, setDrawLine: setDrawLine,
        setCurrentWidth: setCurrentWidth, setDeleteAll: setDeleteAll, setUndo: setUndo
    }

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
            <CanvasContext.Provider value={canvasContextValues}>
                <Canvas />
            </CanvasContext.Provider>
            {true &&
                <ToolBarContext.Provider value={toolbarValues}>
                    <ToolBar />
                </ToolBarContext.Provider>
            }
        </>
    )
}

export default CanvasContainer