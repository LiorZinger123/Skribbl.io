import React from "react"
import Select, { SingleValue } from 'react-select'
import { SetPassword, Setting } from "../../types/CreateRoomTypes/types"

type Props = {
    setting: Setting | SetPassword,
    updateRoomSettings: (id: string, data: string) => void,
    setDisablePass: React.Dispatch<React.SetStateAction<boolean>>
}

const CustomSelect = (props: Props) => {

    const options = props.setting.options.map(option => {
        if(props.setting.id !== "password")
            return { value: option, label: `${option} ${props.setting.id}` }
        else
            return { value: option, label: option }
    })
    
    const colourStyles = {
        control: (base: any) => ({
            ...base,
            background: "transparent",
            border: "1px solid white",
            boxShadow: 'none',
            '&:hover': {
                border: '2px solid white'
            },
            cursor: 'pointer'
        }),
        singleValue:(provided:any) => ({
            ...provided,
            color:'white',
        }),
        dropdownIndicator: (base: any, state: any) => ({
            ...base,
            color: "white",
            boxShadow: 'none',
            '&:hover': {
                color: 'white',
            },
            transition: 'all .2s ease',
            transform: state.selectProps.menuIsOpen ? 'rotate(-180deg)' : null
        }),
        menuList: (base: any) => ({
            ...base,
            background: "#822bd3",
            "::-webkit-scrollbar": {
                width: "1em"
            },
            "::-webkit-scrollbar-track": {
                backgroundColor: "white",
                borderRadius: "10px"
            },            
            "::-webkit-scrollbar-thumb": {
                backgroundColor: "#b378eb",
                borderRadius: "10px"
            },
            "::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#a35ae8",
                borderRadius: "10px"
            }
        }),
        option: (styles: any) => ({          
            ...styles,
            backgroundColor: "#822bd3",
            width: "100%",
            height: "100%",
            boxShadow: 'none',
            '&:hover': {
                backgroundColor: "rgb(114, 16, 205)",
                cursor: "pointer"
            }
        })
    }

    const handleSelectChange = (e: SingleValue<{ value: string | number, label: string | number }>, id: string): void => {
        if(typeof e?.value === 'string'){
            if(id !== 'password')
                props.updateRoomSettings(props.setting.id, e.value)
            else{
                if(e.value === 'Yes')
                    props.setDisablePass(false)
                else
                    props.setDisablePass(true)
            }   
        }
    }

  return (
    <div className="select-container">
        <Select options={options} className="select-box" styles={colourStyles}
            defaultValue={options[0]} onChange={e => handleSelectChange(e, props.setting.id)} isSearchable={false} />
    </div>
  )
}

export default CustomSelect