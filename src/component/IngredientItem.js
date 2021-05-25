import React from 'react'
import styleClass from '../css/IngredientItem.module.css'


const IngredientItem = (props) => {
    return (<div className={`${styleClass.item} ${props.styleClass}`}>{props.children}</div>)
}

export default IngredientItem;