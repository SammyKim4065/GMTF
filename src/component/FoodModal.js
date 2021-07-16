import React from "react";
import styleClass from "../css/FoodModal.Module.css";

export default function FoodModal({
  handleClose,
  show,
  value,
  onNavigToFoodDetail,
}) {
  const caloric = value.caloric;
  return (
    <div
      className={`${show ? styleClass.modal : styleClass.displayNone}`}
      onClick={handleClose}
    >
      <div className={styleClass.modalMain}>
        <div>
          <img src={value.image} alt="foodimg" />

          <p className={styleClass.title}>{value.name}</p>
          <section>
            <p className={styleClass.nutrition}>
              Healthy : <br /> {value.healthScore} %
            </p>

            <p className={styleClass.nutrition}>
              Likes : <br /> {value.likes}
            </p>
            <p className={styleClass.nutrition}>
              Minutes : <br /> {value.minutes}
            </p>
            {!!caloric && (
              <>
                <p className={styleClass.nutrition}>
                  Carbs : <br /> {caloric.percentCarbs} %
                </p>
                <p className={styleClass.nutrition}>
                  Fat : <br /> {caloric.percentFat} %
                </p>
                <p className={styleClass.nutrition}>
                  Protein : <br />
                  {caloric.percentProtein} %
                </p>
              </>
            )}
          </section>

          <p
            className={styleClass.moreDetail}
            onClick={() => onNavigToFoodDetail(value.foodId)}
          >
            Click for more detail
          </p>
        </div>
        <button
          type="button"
          className={styleClass.close}
          onClick={handleClose}
        >
          X
        </button>
      </div>
    </div>
  );
}
