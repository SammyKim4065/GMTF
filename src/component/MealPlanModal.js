import { useState, forwardRef, useReducer, useEffect } from "react";
import styleClass from "../css/MealPlanModal.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import firebase from "../utilize/Firebase.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudSun,
  faCloudMoon,
  faCloud,
} from "@fortawesome/free-solid-svg-icons";
import Lottie from "react-lottie";
import animationData from "../lotties/21369-confetti.json";

function MealPlanModal({ handleClose, show, foodDetail, foodId }) {
  const [startDate, setStartDate] = useState(new Date());
  const [isDurationMealValidate, setIsDurationMealValidate] = useState(false);
  const nutrition = foodDetail.nutrition;
  const [isSuccess, setIsSuccess] = useState(false);

  const insertMealPlaning = () => {
    let isBreakfastSuccess = false;
    let isLunchSuccess = false;
    let isDinnerSuccess = false;

    if (durationMealState.isBreakfastActive) {
      postMealPlan("Breakfast")
        ? (isBreakfastSuccess = true)
        : (isBreakfastSuccess = false);
    }

    if (durationMealState.isLunchActive) {
      postMealPlan("Lunch")
        ? (isLunchSuccess = true)
        : (isLunchSuccess = false);
    }

    if (durationMealState.isDinnerActive) {
      postMealPlan("Dinner")
        ? (isDinnerSuccess = true)
        : (isDinnerSuccess = false);
    }

    setIsSuccess(isBreakfastSuccess || isLunchSuccess || isDinnerSuccess);

    setTimeout(() => {
      setIsSuccess(false);
      handleClose();
      durationMealDispatch({ type: "CLEAR" });
    }, 2000);
  };

  const postMealPlan = (duration) => {
    const hash = localStorage.getItem("userHash");
    const date = `${startDate.getDate()}-${startDate.getMonth()}-${startDate.getFullYear()}`;

    const mealPlanning = firebase
      .database()
      .ref(`MealPlanning/${hash}/${date}`);
    let res = false;
    mealPlanning
      .push({
        foodId: foodId,
        name: foodDetail.title,
        duration: duration,
        image: foodDetail.image,
        caloric: nutrition.caloricBreakdown,
        likes: foodDetail.aggregateLikes,
        minutes: foodDetail.readyInMinutes,
        healthScore: foodDetail.healthScore,
      })
      .once("value", (snapchat) => {
        res = snapchat.exists();
      });

    return res;
  };

  const onOkayClick = () => {
    insertMealPlaning();
  };

  const onCancelClick = () => {
    handleClose();
    durationMealDispatch({ type: "CLEAR" });
  };

  const durationMealReducer = (state, action) => {
    switch (action.type) {
      case "BREAKFAST":
        return {
          isBreakfastActive: action.isBreakfastActive,
          isLunchActive: state.isLunchActive,
          isDinnerActive: state.isDinnerActive,
        };

      case "LUNCH":
        return {
          isBreakfastActive: state.isBreakfastActive,
          isLunchActive: action.isLunchActive,
          isDinnerActive: state.isDinnerActive,
        };

      case "DINNER":
        return {
          isBreakfastActive: state.isBreakfastActive,
          isLunchActive: state.isLunchActive,
          isDinnerActive: action.isDinnerActive,
        };

      case "CLEAR":
        return {
          isBreakfastActive: false,
          isLunchActive: false,
          isDinnerActive: false,
        };

      default:
        return {
          isBreakfastActive: false,
          isLunchActive: false,
          isDinnerActive: false,
        };
    }
  };

  const [durationMealState, durationMealDispatch] = useReducer(
    durationMealReducer,
    {
      durationText: null,
      isBreakfastActive: false,
      isLunchActive: false,
      isDinnerActive: false,
    }
  );

  const breakfastHandler = () => {
    const value = "Breakfast";
    durationMealDispatch({
      type: value.toUpperCase(),
      durationText: value,
      isBreakfastActive: !durationMealState.isBreakfastActive,
    });
  };

  const lunchHandler = () => {
    const value = "Lunch";
    durationMealDispatch({
      type: value.toUpperCase(),
      durationText: value,
      isLunchActive: !durationMealState.isLunchActive,
    });
  };

  const dinnerHandler = () => {
    const value = "Dinner";
    durationMealDispatch({
      type: value.toUpperCase(),
      durationText: value,
      isDinnerActive: !durationMealState.isDinnerActive,
    });
  };

  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <button className={styleClass.datePickerBtn} onClick={onClick} ref={ref}>
      {value}
    </button>
  ));

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    const isActive =
      durationMealState.isBreakfastActive ||
      durationMealState.isLunchActive ||
      durationMealState.isDinnerActive;
    setIsDurationMealValidate(isActive);
  }, [durationMealState]);

  return (
    <>
      <div
        onClick={handleClose}
        className={`${show ? styleClass.modal : styleClass.displaynone}`}
      ></div>

      <div
        className={`${show ? styleClass.modalMain : styleClass.displaynone}`}
      >
        <div className={styleClass.mealPlanBox}>
          <p className={styleClass.headerMealPlan}>Meal Planning</p>

          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            customInput={<ExampleCustomInput />}
          />

          <div className={styleClass.durationBox}>
            <div
              className={`${
                durationMealState.isBreakfastActive
                  ? styleClass.breakfastBtn
                  : styleClass.disableDurationBtn
              }`}
              onClick={breakfastHandler}
            >
              <FontAwesomeIcon icon={faCloudSun} className={styleClass.icon} />
              <p>Breakfast</p>
            </div>

            <div
              className={`${
                durationMealState.isLunchActive
                  ? styleClass.lunchBtn
                  : styleClass.disableDurationBtn
              }`}
              onClick={lunchHandler}
            >
              <FontAwesomeIcon icon={faCloud} className={styleClass.icon} />
              <p>Lunch</p>
            </div>

            <div
              src="/img/cloud.png"
              className={`${
                durationMealState.isDinnerActive
                  ? styleClass.dinnerBtn
                  : styleClass.disableDurationBtn
              }`}
              onClick={dinnerHandler}
            >
              <FontAwesomeIcon icon={faCloudMoon} className={styleClass.icon} />
              <p>Dinner</p>
            </div>
          </div>

          <div className={styleClass.btnBox}>
            <button className={styleClass.cancelBtn} onClick={onCancelClick}>
              Cancel
            </button>

            <button
              className={`${
                isDurationMealValidate
                  ? styleClass.okayBtn
                  : styleClass.disableBtn
              }`}
              onClick={onOkayClick}
              disabled={!isDurationMealValidate}
            >
              Okay
            </button>
          </div>
        </div>

        <button
          type="button"
          className={styleClass.close}
          onClick={onCancelClick}
        >
          X
        </button>
      </div>

      <div
        className={`${
          isSuccess ? styleClass.confetti : styleClass.displaynone
        }`}
      >
        <Lottie options={defaultOptions} />
      </div>
    </>
  );
}

export default MealPlanModal;
