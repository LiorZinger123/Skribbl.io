import React from 'react';
import Colors from './Colors';
import Modes from './Modes';
import ChooseThickness from './Thicknesses/ChooseThickness';

type Props = {
    currentColor: string,
    setCurrentColor: React.Dispatch<React.SetStateAction<string>>,
    setDrawLine: React.Dispatch<React.SetStateAction<boolean>>,
    setCurrentWidth: React.Dispatch<React.SetStateAction<number>>,
    setDeleteAll: React.Dispatch<React.SetStateAction<boolean>>,
    drawLine: boolean,
    setUndo: React.Dispatch<React.SetStateAction<boolean>>
}

const ToolBar = (props: Props) => {
  
    return (
        <div className="toolbar">
            <Colors currentColor={props.currentColor} setCurrentColor={props.setCurrentColor} />
            <ChooseThickness setCurrentWidth={props.setCurrentWidth} />
            <Modes setDrawLine={props.setDrawLine} setDeleteAll={props.setDeleteAll} 
                drawLine={props.drawLine} setUndo={props.setUndo} />
        </div>
    )
}

export default ToolBar