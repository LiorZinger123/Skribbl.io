import { useContext } from "react"
import { ToolBarContext } from "../CanvasContainer"

const Colors = () => {

  const props = useContext(ToolBarContext)
  const colors = ["#ffffff", "#c1c1c1", "#ef130b", "#ff7100", "#ffe400", "#00cc00", "#00b2ff", "#231fd3",
                    "#a300ba", "#d37caa", "#a0522d", "#000000", "#4c4c4c", "#740b07", "#c23800", "#e8a200",
                    "#005510", "#00569e", "#0e0865", "#550069", "#a75574", "#63300d"]
  
  return (
    <div className="colors-container">

        <div className="toolbar-cell" style={{ "backgroundColor": props.currentColor }}></div>
        <div className="colors">
            {colors.map(color => (
                <div key={color} className="color" style={{ "backgroundColor": color }} 
                    onClick={() => props.setCurrentColor(color)}></div>
            ))}
        </div>
    
    </div>
  )
}

export default Colors