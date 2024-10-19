import "./TextField.css"



const TextField = (props) => {
    const PlaceHolder = `Enter ${props.label}...`

    return (
        <div className="text-field">
            <label>{props.label}</label>
            <input placeholder={PlaceHolder}/>
        </div>
    )

}

export default TextField
