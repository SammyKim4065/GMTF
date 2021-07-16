import { useState, useEffect } from "react";
import styleClass from "../css/DetailFood.module.css";
import "react-datepicker/dist/react-datepicker.css";
import FastAverageColor from "fast-average-color";
import { apiUrl, apiKey } from "../utilize/api";
import { useParams } from "react-router-dom";
import MealPlanModal from "./MealPlanModal";
import animationData from "../lotties/60366-pizza-ingrediants.json";
import cookAnim from "../lotties/6519-cooking.json";
import Lottie from "react-lottie";
import loadingAnim from "../lotties/7751-load.json";

function DetailFood() {
  const { foodId } = useParams();
  const [foodDetail, setfoodDetail] = useState({});
  const [colorDiv, setColorDiv] = useState("");
  const [isShowModal, setIsShowModal] = useState(false);
  const nutrition = foodDetail.nutrition != null ? foodDetail.nutrition : "0.0";
  const caloricBreakdown =
    nutrition.caloricBreakdown != null ? nutrition.caloricBreakdown : "0.0";
  const [isLoading, setIsLoading] = useState(false);

  const fac = new FastAverageColor();
  const fetchFoodDetailData = async () => {
    setIsLoading(true);
    const responce = await fetch(
      apiUrl +
        "/recipes/" +
        foodId +
        "/information?apiKey=" +
        apiKey +
        "&includeNutrition=true"
    );

    if (responce.ok) {
      const data = await responce.json();
      setfoodDetail(data);
    }
  };

  const generateColor = () => {
    if (foodDetail.image != null) {
      fac
        .getColorAsync(foodDetail.image)
        .then((color) => {
          setColorDiv(color);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const ingredientOption = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const cookOption = {
    loop: true,
    autoplay: true,
    animationData: cookAnim,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const loadingOption = {
    loop: true,
    autoplay: true,
    animationData: loadingAnim,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleClose = () => {
    setIsShowModal(!isShowModal);
  };

  useEffect(() => {
    fetchFoodDetailData();
  }, []);

  useEffect(() => {
    Object.keys(foodDetail).length === 0
      ? setIsLoading(true)
      : setIsLoading(false);
  }, [Object.keys(foodDetail).length]);

  useEffect(() => {
    generateColor();
  }, [foodDetail.image]);

  return (
    <>
      <div className={styleClass.root}>
        <div className={styleClass.container}>
          <div className={styleClass.imageFood}>
            <img src={foodDetail.image} alt="foodimage"></img>

            <img
              className={styleClass.cookie}
              src="/img/cookieicon.png"
              onClick={handleClose}
              alt="cookie"
            />
          </div>
          <div className={styleClass.contentBox}>
            <p
              className={styleClass.title}
              style={{
                color: colorDiv.hex,
              }}
            >
              {foodDetail.title}
            </p>

            <section>
              <p>Healthy : {foodDetail.healthScore} %</p>
              <p>Aggregate likes : {foodDetail.aggregateLikes}</p>
              <p>Ready in minutes : {foodDetail.readyInMinutes}</p>
              <p>Carbohydrate : {caloricBreakdown.percentCarbs} %</p>
              <p>Fat : {caloricBreakdown.percentFat} %</p>
              <p>Protein : {caloricBreakdown.percentProtein} %</p>
              <p>Weight per serving : {foodDetail.weightPerServing} %</p>
            </section>

            <p className={styleClass.summary}>
              {!!foodDetail.summary &&
                foodDetail.summary.replace(/(<([^>]+)>)/gi, "")}
            </p>
          </div>
          <div className={styleClass.line}></div>

          <div className={styleClass.secondSection}>
            <div className={styleClass.secondContainer}>
              <p className={styleClass.bigFont}>Ingredients</p>
              <Lottie options={ingredientOption} />
              <div className={styleClass.ingredientBox}>
                {!!foodDetail.extendedIngredients &&
                  foodDetail.extendedIngredients.map((item, index) => (
                    <p key={index} className={styleClass.ingredientText}>
                      {item.originalString}
                    </p>
                  ))}
              </div>
            </div>

            <div className={styleClass.verticalLine}></div>

            <div className={styleClass.secondContainer}>
              <p className={styleClass.bigFont}>Instructions</p>
              <Lottie options={cookOption} />
              <div className={styleClass.ingredientBox}>
                {!!foodDetail.extendedIngredients &&
                  foodDetail.extendedIngredients.map((item, index) => (
                    <p key={index} className={styleClass.instructionText}>
                      {index + 1}. {item.originalString}
                    </p>
                  ))}
              </div>
            </div>
          </div>

          <div
            className={`${
              isLoading ? styleClass.display : styleClass.displayNone
            }`}
          >
            <Lottie options={loadingOption} height={400} width={400} />
          </div>
          <MealPlanModal
            show={isShowModal}
            handleClose={handleClose}
            foodDetail={foodDetail}
            foodId={foodId}
          />
        </div>
      </div>
    </>
  );
}

export default DetailFood;
