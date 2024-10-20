import "./DropDownList.css"

const DropDownList = (props) => {
    return(
        <div className="drop-down-list">
            <label>{props.label}</label>
            <select onChange={event => props.setValue(event.target.value)} value={props.value}>
                {props.itens.map(item => {
                    return <option key={item}>{item}</option>
                })}
            </select>
        </div>
    )
} 

export default DropDownList