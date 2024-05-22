import { useState } from "react"
import { useContext } from "react"
import { ToolBarContext } from "../../CanvasContainer"
import CanvasThicknesses from "./ThicknessesComponents/CanvasThicknesses"
import CurrentThickness from "./ThicknessesComponents/CurrentThickness"

const ChooseThickness = () => {

    const props = useContext(ToolBarContext)  
    const [showThicknesses, setShowThicknesses] = useState<boolean>(false)
    const [currentThickness, setCurrentThickness] = useState<string>('small')

  return (
    <div className="choose-thickness">
        {<CanvasThicknesses showThicknesses={showThicknesses} setShowThicknesses={setShowThicknesses} setCurrentThickness={setCurrentThickness} />}
        <CurrentThickness currentThickness={currentThickness} setShowThicknesses={setShowThicknesses} setCurrentWidth={props.setCurrentWidth} />
    </div>
  )
}

export default ChooseThickness