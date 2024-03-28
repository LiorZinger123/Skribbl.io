import BrushIcon from '@mui/icons-material/Brush';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import DeleteIcon from '@mui/icons-material/Delete';

type Props = {
    setDrawLine: React.Dispatch<React.SetStateAction<boolean>>,
    setCurrentWidth: React.Dispatch<React.SetStateAction<number>>,
    setDeleteAll: React.Dispatch<React.SetStateAction<boolean>>
}

const Modes = (props: Props) => {

    const modes = [<BrushIcon className='modes-icon' fontSize='large' onClick={() => props.setDrawLine(true)} />, 
                  <FormatColorFillIcon className='modes-icon' fontSize='large' onClick={() => props.setDrawLine(false)} />,
                  <DeleteIcon className='modes-icon' fontSize='large' onClick={() => props.setDeleteAll(del => !del)} />]

  return (
    <div className='modes'>   
        {modes.map(mode => (
            <div key={4} className='toolbar-cell modes-cell'>{mode}</div> //change key
        ))}
    </div>
  )
}

export default Modes