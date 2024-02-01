import { useEffect, useRef } from "react"

const Room = () => {
 
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  
  useEffect(() => {
    const context = canvasRef.current?.getContext('2d')
  }, [])

  return (
    <div>
      <canvas ref={canvasRef}>

      </canvas>
    </div>
  )
}

export default Room