import React, { useEffect } from "react";
import ReactDOM from 'react-dom'
import styleClass from "../css/DetailFood.module.css";
import Parser from "html-react-parser";
import IngredientItem from "./IngredientItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";

const OverlayDetailFood = (props) => {
<div className={`${styleClass.root} ${props.classStyle}`}>
      <div className={styleClass.closeIcon} onClick={props.closeHandler}>
        <FontAwesomeIcon icon={faTimesCircle} size="2x" />
      </div>
      <div className={styleClass.image}>
        <img src={food.image} />
      </div>

      <div className={styleClass.contain}>
        <p className={styleClass.title}>{food.title}</p>

        <p
          className={`${styleClass.paddingContain} ${styleClass.ingredientTitle}`}
        >
          Ingredient
        </p>

        <div className={styleClass.paddingContain}>
          {food.extendedIngredients != null
            ? food.extendedIngredients.map((item, index) => (
                <IngredientItem
                  styleClass={styleClass.ingredientItem}
                  key={index}
                >
                  <p>{item.name}</p>
                </IngredientItem>
              ))
            : ""}
        </div>

        <p className={styleClass.ingredientTitle}>Instruction</p>
        <p className={styleClass.instructionContent}>
         {instruction}
        </p>
      </div>
    </div>
}
const DetailFood = (props) => {
  const food = props.foodData;
  const instruction = food.instructions != null
  ? Parser(food.instructions)
  : "no instructions"
  return (
    <React.Fragment>
      {ReactDOM.createPortal(<OverlayDetailFood styleClass={props.styleClass} closeHandler={props.closeHandler} food={food}/>,document.getElementById('modalRoot'))}
    </React.Fragment>
    
  );
};

export default DetailFood;
