import React from "react"

type Props = {
    size: string,
    setCurrentThickness: React.Dispatch<React.SetStateAction<string>>
}

const ThicknessItem = (props: Props) => {

  return (
    <div className="thickness-item" onClick={() => props.setCurrentThickness(props.size)}>
        <div className={`thickness-circle ${props.size}`}></div>
    </div>
  )
}

export default ThicknessItem