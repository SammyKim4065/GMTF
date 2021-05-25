import { useEffect, useState, useRef } from "react";
import { apiUrl, apiKey, includeNutrition } from "../utilize/api";
import FoodItem from "./FoodItem";
import styleClass from "../css/Dashboard.module.css";
import DetailFood from "./DetailFood";
import Header from "./Header";

const Dashboard = () => {
  const [foods, setFoods] = useState([]);
  const [foodDetail, setfoodDetail] = useState({});
  const [isOpenFoodDetail, setIsOpenFoodDetail] = useState(false);
  const allFoods = [];
  const type = "breakfast,beverage,appetizer";
  const number = 50;
 

  async function fetchFoodData() {
    const response = await fetch(
      apiUrl +
        "/recipes/complexSearch?type=" +
        type +
        "&number=" +
        number +
        "&apiKey=" +
        apiKey +
        "&" +
        includeNutrition +
        "=true"
    );
    const data = await response.json();

    data.results.map((item) => {
      allFoods.push(item);
    });

    setFoods(allFoods);
  }

  async function fetchFoodDetailData(foodId) {
    const responce = await fetch(
      apiUrl +
        "/recipes/" +
        foodId +
        "/information?apiKey=" +
        apiKey +
        "&includeNutrition=true"
    );
    const data = await responce.json();
    setfoodDetail(data);
    setIsOpenFoodDetail(true);
  }

  const foodDetailHandle = (foodId) => {
    fetchFoodDetailData(foodId);
  };

  const closeFoodDetailHandler = () => {
    setIsOpenFoodDetail((oldValue) => !oldValue);
    setfoodDetail({});
  };

  const foodDetailValidate = isOpenFoodDetail ? (
    <DetailFood
      foodData={foodDetail}
      classStyle={styleClass.foodDetail}
      closeHandler={closeFoodDetailHandler}
    />
  ) : (
    <></>
  );

  useEffect(() => {
    fetchFoodData();
  }, []);

  return (
    <>
      <Header />

      <div className={styleClass.dashboadContainer}>
        <div className={styleClass.foodContainer}>
          <div></div>
          <FoodItem
            items={foods}
            styleClass={styleClass.foodItem}
            detailFoodHandle={foodDetailHandle}
          />
          <div></div>
        </div>

        {foodDetailValidate}
      </div>
    </>
  );
};

export default Dashboard;
