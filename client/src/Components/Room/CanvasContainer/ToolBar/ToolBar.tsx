import Colors from './Colors';
import Modes from './Modes';

type Props = {
    currentColor: string,
    setCurrentColor: React.Dispatch<React.SetStateAction<string>>,
    setDrawLine: React.Dispatch<React.SetStateAction<boolean>>,
    setCurrentWidth: React.Dispatch<React.SetStateAction<number>>,
    setDeleteAll: React.Dispatch<React.SetStateAction<boolean>>
}

const ToolBar = (props: Props) => {
  
    return (
        <div className="toolbar">
            <Colors currentColor={props.currentColor} setCurrentColor={props.setCurrentColor} />
            <Modes setDrawLine={props.setDrawLine} setCurrentWidth={props.setCurrentWidth} setDeleteAll={props.setDeleteAll} />
        </div>
    )
}

export default ToolBar