import React from "react";
import stlyeClass from "../css/MealPlanningItem.Module.css";
import MealPlanImageItem from "./MealPlanImagItem";
import firebase from "../utilize/Firebase.js";

export default function MealPlanningItem({
  values,
  index,
  onModalHandler,
  onNavigToFoodDetail,
}) {
  const onDeleteHandler = (date, id) => {
    const hash = localStorage.getItem("userHash");
    const mealPlanning = firebase
      .database()
      .ref(`MealPlanning/${hash}/${date}/${id}`);
    mealPlanning.remove();
  };

  const monthString = new Date(
    0,
    parseInt(values.date.split("-")[1]) + 1,
    0
  ).toLocaleDateString("en-Us", {
    month: "short",
  });

  const breakfast = () =>
    values.breakfast.length !== 0 ? (
      values.breakfast.map((item, i) => (
        <MealPlanImageItem
          value={item[1]}
          date={values.date}
          index={i}
          id={item[0]}
          onDeleteHandler={onDeleteHandler}
          onModalHandler={onModalHandler}
          onNavigToFoodDetail={onNavigToFoodDetail}
        />
      ))
    ) : (
      <div style={{ width: "9vw" }}></div>
    );

  const lunch = () =>
    values.lunch.length !== 0 ? (
      values.lunch.map((item, i) => (
        <MealPlanImageItem
          value={item[1]}
          date={values.date}
          index={i}
          id={item[0]}
          onDeleteHandler={onDeleteHandler}
          onModalHandler={onModalHandler}
          onNavigToFoodDetail={onNavigToFoodDetail}
        />
      ))
    ) : (
      <div style={{ width: "9vw" }}></div>
    );

  const dinner = () =>
    values.dinner.length !== 0 ? (
      values.dinner.map((item, i) => (
        <MealPlanImageItem
          value={item[1]}
          date={values.date}
          index={i}
          id={item[0]}
          onDeleteHandler={onDeleteHandler}
          onModalHandler={onModalHandler}
          onNavigToFoodDetail={onNavigToFoodDetail}
        />
      ))
    ) : (
      <div style={{ width: "9vw" }}></div>
    );

  return (
    <>
      <div className={stlyeClass.container} key={index}>
        <div className={stlyeClass.headerItemMealPlan}>
          <div>
            <p>{values.date.split("-")[0]}</p>

            <p className={stlyeClass.monthString}>{monthString}</p>
          </div>
        </div>

        <div className={stlyeClass.mealContainer}>
          <div className={stlyeClass.mealItem}>
            <p className={stlyeClass.breakfastText}>Breakfast</p>
            <div className={stlyeClass.mealsBox}>{breakfast()}</div>
          </div>

          <div className={stlyeClass.mealItem}>
            <p className={stlyeClass.durationText}>Lunch</p>
            <div className={stlyeClass.mealsBox}>{lunch()}</div>
          </div>

          <div className={stlyeClass.mealItem}>
            <p className={stlyeClass.durationText}>Dinner</p>
            <div className={stlyeClass.mealsBox}> {dinner()}</div>
          </div>
        </div>
      </div>
    </>
  );
}
