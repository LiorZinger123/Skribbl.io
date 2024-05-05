import React, { useEffect } from "react"

type Props = {
    drawing: string,
    contextRef: React.MutableRefObject<CanvasRenderingContext2D | null>
}

const useUpdateDrawing = (props: Props) => {

    useEffect(() => {
      const img = new Image()
      img.src = props.drawing
      img.onload = () => {
          props.contextRef.current?.drawImage(img, 0, 0)
      }
    }, [props.drawing])

}

export default useUpdateDrawing