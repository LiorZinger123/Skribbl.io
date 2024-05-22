import useTurnFunctions from "./CanvasHooks/TurnFunctions/useTurnFunctions"
import useDrawingFunctions from "./CanvasHooks/DrawingFunctions/useDrawingFunctions"
import useUpdateDrawing from "./CanvasHooks/UpdateDrawing/useUpdateDrawing"
import useDeleteAll from "./CanvasHooks/DeleteAll/useDeleteAll"
import useUndo from "./CanvasHooks/Undo/useUndo"

const CanvasFunctions = () => {
  // console.log('o')
  useTurnFunctions()
  useDrawingFunctions()
  useUpdateDrawing()
  useDeleteAll()
  useUndo()

  return (
    <></>
  )
}

export default CanvasFunctions