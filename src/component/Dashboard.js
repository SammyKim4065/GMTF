import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { apiUrl, apiKey, includeNutrition } from "../utilize/api";
import Foods from "./Foods";
import styleClass from "../css/Dashboard.module.css";
import Lottie from "react-lottie";
import loadingAnim from "../lotties/7751-load.json";
import headerStyleClass from "../css/Header.module.css";

const Dashboard = (props) => {
  const [foods, setFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const allFoods = [];
  const type = "breakfast,beverage,appetizer";
  const number = 30;
  const history = useHistory();

  const fetchFoodData = async () => {
    setIsLoading(true);

    const response = await fetch(
      apiUrl +
        "/recipes/complexSearch?type=" +
        type +
        "&number=" +
        number +
        "&query=" +
        props.valueSearch +
        "&apiKey=" +
        apiKey +
        "&" +
        includeNutrition +
        "=true"
    );
    const data = await response.json();

    data.results.map((item) => allFoods.push(item));

    setFoods(allFoods);
    setIsLoading(false);
  };

  const foodDetailHandler = (foodId) => {
    history.push("/detail/" + foodId);
    props.clearSearch();
  };

  const loadingOption = {
    loop: true,
    autoplay: true,
    animationData: loadingAnim,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    fetchFoodData();
  }, [props.valueSearch]);

  return (
    <>
      <div className={styleClass.dashboadContainer}>
        <div className={headerStyleClass.containerTextLogo}>
          <img src="/img/croissant.png" alt="croissant"></img>
          <p className={headerStyleClass.logoText}>GIVE ME THAT RECIPE</p>
        </div>
        <div className={styleClass.foodContainer}>
          <div></div>

          <Foods items={foods} detailFoodHandle={foodDetailHandler} />
          <div></div>
        </div>

        <div
          className={`${
            isLoading ? styleClass.display : styleClass.displayNone
          }`}
        >
          <Lottie options={loadingOption} height={400} width={400} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
