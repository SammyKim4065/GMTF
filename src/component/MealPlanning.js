import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import firebase from "../utilize/Firebase.js";
import stlyeClass from "../css/MealPlanning.module.css";
import MealPlanningItem from "./MealPlanningItem.js";
import FoodModal from "./FoodModal.js";
import loadingAnim from "../lotties/7751-load.json";
import Lottie from "react-lottie";
import { sortAndGroupDate, SelectDateHandler } from "../utilize/Date.js";
import CalendarCustom from "./CalendarCustom.js";

const MealPlanning = () => {
  const [meal, setMeal] = useState([]);
  const [selectedDate, setSelectedDate] = useState();
  const [isShowModal, setIsShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const mealPlanning = firebase.database().ref(`MealPlanning`);
  const [value, setValue] = useState("");
  const history = useHistory();

  const queryMealPlanning = () => {
    setIsLoading(true);
    const hash = localStorage.getItem("userHash");

    mealPlanning.on("value", (snapshot) => {
      snapshot.forEach((item) => {
        const key = item.key;
        if (key === hash) {
          const sortedMeals = sortAndGroupDate(Object.entries(item.val()));
          setMeal(sortedMeals);
          setSelectedDate(
            SelectDateHandler({
              _meal: sortedMeals,
              otherDate: new Date(),
            })
          );
          setIsLoading(false);
        }
      });
    });
  };

  const handleClose = () => {
    setIsShowModal(false);
  };

  const onModalHandler = (value) => {
    setValue(value);
    setIsShowModal(!isShowModal);

    console.log(value);
  };

  const loadingOption = {
    loop: true,
    autoplay: true,
    animationData: loadingAnim,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const backMonthHandler = ({ date }) => {
    const _date = new Date(date.getFullYear(), date.getMonth(), 0);

    setSelectedDate(
      SelectDateHandler({
        _meal: meal,
        otherDate: _date,
      })
    );
  };

  const nextMonthHandler = ({ date }) => {
    const _date = new Date(date.getFullYear(), date.getMonth() + 1, 1);

    setSelectedDate(
      SelectDateHandler({
        _meal: meal,
        otherDate: _date,
      })
    );
  };

  const onNavigToFoodDetail = (foodId) => {
    history.push("/detail/" + foodId);
  };

  const groupMealByDuration = () => {
    let meal = [];
    selectedDate.map((item) => {
      if (!!item[1]) {
        const date = item[0];
        const values = Object.entries(item[1]);

        const breakfast = values.filter(
          (item) => item[1].duration === "Breakfast"
        );
        const lunch = values.filter((item) => item[1].duration === "Lunch");
        const dinner = values.filter((item) => item[1].duration === "Dinner");

        const _meal = {
          date: date,
          breakfast: breakfast,
          lunch: lunch,
          dinner: dinner,
        };
        const obj = {};
        meal.push((obj[date] = _meal));
      }
    });
    return meal;
  };

  useEffect(() => {
    queryMealPlanning();
  }, []);

  return (
    <div className={stlyeClass.root}>
      <FoodModal show={isShowModal} handleClose={handleClose} value={value} />
      <div className={stlyeClass.container}>
        <div>
          {!!selectedDate && (
            <>
              <CalendarCustom
                date={selectedDate}
                nextMonthHandler={nextMonthHandler}
                backMonthHandler={backMonthHandler}
              />
              {groupMealByDuration().map((item, i) => (
                <MealPlanningItem
                  values={item}
                  index={i}
                  onModalHandler={onModalHandler}
                  onNavigToFoodDetail={onNavigToFoodDetail}
                />
              ))}
            </>
          )}
        </div>
      </div>
      <div
        className={`${isLoading ? stlyeClass.display : stlyeClass.displayNone}`}
      >
        <Lottie options={loadingOption} height={400} width={400} />
      </div>
    </div>
  );
};

export default MealPlanning;
