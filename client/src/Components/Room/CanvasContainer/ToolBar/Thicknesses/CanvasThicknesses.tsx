import React from "react"
import ThicknessItem from "./ThicknessItem"

type Props = {
  showThicknesses: boolean,
  setShowThicknesses: React.Dispatch<React.SetStateAction<boolean>>,
  setCurrentThickness: React.Dispatch<React.SetStateAction<string>>
}

const CanvasThicknesses = (props: Props) => {

    const listThiclnesses = ['large', 'medium', 'small']

  return (
    <div className={`thicknesses ${props.showThicknesses ? 'show-thicknesses' : 'hide-thicknesses'}`} onClick={() => props.setShowThicknesses(false)} onMouseEnter={() => props.setShowThicknesses(true)} onMouseLeave={() => props.setShowThicknesses(false)}>
      {listThiclnesses.map(item => (
        <ThicknessItem key={item} size={item} setCurrentThickness={props.setCurrentThickness} />
      ))}
    </div>
  )
}

export default CanvasThicknesses