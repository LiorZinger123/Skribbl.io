import { useContext } from "react"
import { ToolBarContext } from "../CanvasContainer";
import BrushIcon from '@mui/icons-material/Brush';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import UndoIcon from '@mui/icons-material/Undo';

const Modes = () => {

    const props = useContext(ToolBarContext)  
    const modes = [{ icon: <BrushIcon className='modes-icon' fontSize='large' />, classname: `pointer-modes-cell ${props.drawLine ? 'selected-icon' : 'unselected-icon'}`, click: () => props.setDrawLine(true), key: 'line'}, 
    { icon: <FormatColorFillIcon className='modes-icon' fontSize='large' />, classname: `pointer-modes-cell ${!props.drawLine ? 'selected-icon' : 'unselected-icon'}`, click: () => props.setDrawLine(false), key: 'fill'},
    { icon: <UndoIcon className='modes-icon undo-icon' fontSize='large' onClick={() => props.setUndo(undo => !undo)} />, key: 'undo' },
    { icon: <DeleteOutlineOutlinedIcon className='modes-icon delete-icon' fontSize='large' onClick={() => props.setDeleteAll(del => !del)} />, key: 'delete'}]

  return (
    <div className='modes'>   
        {modes.map(mode => (
            <div key={mode.key} className={`toolbar-cell modes-cell ${mode.classname}`} onClick={mode.click}>{mode.icon}</div>
        ))}
    </div>
  )
}

export default Modes