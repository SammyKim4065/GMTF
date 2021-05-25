import { useEffect } from "react";
import styleClass from "../css/FoodItem.module.css";

const FoodItem = (props) => {
  const foods = props.items;
  return (
    <div className={`${styleClass.container} ${props.styleClass}`}>
      {foods.map((food) => (
        <div
          key={food.id}
          className={styleClass.wrapped}
          onClick={() => {
            props.detailFoodHandle(food.id);
          }}
        >
          <img src={food.image} />
          <div className={styleClass.overlay}></div>
          <div className={styleClass.text}>{food.title}</div>
          <div className={styleClass.line}></div>
          <p className={styleClass.detail}>C l i c k   F o r   R e c i p e</p>
        </div>
      ))}
    </div>
  );
};

export default FoodItem;
