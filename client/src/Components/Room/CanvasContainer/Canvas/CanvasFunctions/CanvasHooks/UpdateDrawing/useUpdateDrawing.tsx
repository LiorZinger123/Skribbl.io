import { useEffect, useContext } from "react"
import { CanvasFunctionsContext } from "../../../Canvas"

const useUpdateDrawing = () => {

  const props = useContext(CanvasFunctionsContext)

  useEffect(() => {
    const img = new Image()
    img.src = props.drawing
    img.onload = () => {
      props.contextRef.current?.drawImage(img, 0, 0)
    }
    // console.log('s')
  }, [props.drawing])

}

export default useUpdateDrawing