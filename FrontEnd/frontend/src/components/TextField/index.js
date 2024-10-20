import "./TextField.css"


const TextField = (props) => {
    const PlaceHolder = `Enter ${props.label}...`

    const changeHandler = (event) => {
        props.setValue(event.target.value)
    }

    return (
        <div className="text-field">
            <label>{props.label}</label>
            <input value={props.value} onChange={changeHandler} required={props.mandatory} type={props.type} placeholder={PlaceHolder}/>
        </div>
    )

}

export default TextField
