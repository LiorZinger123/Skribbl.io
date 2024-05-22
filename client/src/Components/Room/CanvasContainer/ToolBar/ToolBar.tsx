import Colors from './Colors';
import Modes from './Modes';
import ChooseThickness from './Thicknesses/ChooseThickness';

const ToolBar = () => {
  
    return (
        <div className="toolbar">
            <Colors />
            <ChooseThickness />
            <Modes />
        </div>
    )
}

export default ToolBar