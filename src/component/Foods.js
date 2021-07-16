import { useRef } from "react";
import styleClass from "../css/Foods.module.css";

const Foods = (props) => {
  const foods = props.items;
  const ref = useRef([]);

  return (
    <div className={styleClass.container}>
      {foods.map((food, index) => (
        <div
          className={styleClass.wrapped}
          key={index}
          ref={(el) => (ref.current[index] = el)}
          onClick={() => {
            props.detailFoodHandle(food.id);
          }}
        >
          <img src={food.image} alt="foodimg" />

          <div className={styleClass.overlay}></div>
          <div className={styleClass.foodBox}>
            <p className={styleClass.text}>{food.title}</p>
            <div>
              <div className={styleClass.line}></div>
              <p className={styleClass.detail}>Click here</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Foods;
