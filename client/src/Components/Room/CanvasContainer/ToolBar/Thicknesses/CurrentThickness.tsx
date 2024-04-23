import React, { useEffect } from "react"

type Props = {
    currentThickness: string,
    setShowThicknesses: React.Dispatch<React.SetStateAction<boolean>>,
    setCurrentWidth: React.Dispatch<React.SetStateAction<number>>
}

const CurrentThickness = (props: Props) => {

    useEffect(() => {
        props.setShowThicknesses(false)
        if(props.currentThickness === 'small')
            props.setCurrentWidth(3)
        else if(props.currentThickness === 'medium')
            props.setCurrentWidth(6)
        else
            props.setCurrentWidth(9)
    }, [props.currentThickness])

    return (
    <div className="current-thickness" onMouseEnter={() => props.setShowThicknesses(true)} onMouseLeave={() => props.setShowThicknesses(false)}>
        <div className={`thickness-circle ${props.currentThickness}`}></div>
    </div>
  )
}

export default CurrentThickness