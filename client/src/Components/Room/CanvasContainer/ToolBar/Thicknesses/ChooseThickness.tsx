import { useState } from "react"
import CanvasThicknesses from "./CanvasThicknesses"
import CurrentThickness from './CurrentThickness'

type Props = {
  setCurrentWidth: React.Dispatch<React.SetStateAction<number>>
}

const ChooseThickness = (props: Props) => {

    const [showThicknesses, setShowThicknesses] = useState<boolean>(false)
    const [currentThickness, setCurrentThickness] = useState<string>('small')

  return (
    <div className="choose-thickness">
        {<CanvasThicknesses showThicknesses={showThicknesses} setShowThicknesses={setShowThicknesses} setCurrentThickness={setCurrentThickness} />}
        <CurrentThickness currentThickness={currentThickness} setShowThicknesses={setShowThicknesses} 
          setCurrentWidth={props.setCurrentWidth} />
    </div>
  )
}

export default ChooseThickness