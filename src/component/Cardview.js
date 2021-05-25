import React from 'react'
import classes from '../css/Cardview.module.css'


const Cardview = (props) => {
    return <div className={`${classes.card} ${props.styleClass}`}>{props.children}</div>
}

export default Cardview