import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faSearch,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import Cardview from "./Cardview";
import styleClass from "../css/Header.module.css";

const Header = () => {
  return (
    <>
      <Cardview styleClass={`${styleClass.cardview}`}>
        <FontAwesomeIcon icon={faBars} />
      </Cardview>

      <Cardview styleClass={`${styleClass.cardview}`}>
        <FontAwesomeIcon icon={faSearch} />
      </Cardview>

      <Cardview styleClass={`${styleClass.shoppingIcon}`}>
        <p className={styleClass.mealPlanningText}>MEAL PLANNING</p>
      </Cardview>

      <div className={styleClass.containerTextLogo}>
        <p className={styleClass.logoText}>GIVE ME THE FOODS</p>
        <p className={styleClass.logoTextSub}>
          IF YOU LOVE ME, GIVE ME THE FOODS
        </p>
      </div>
    </>
  );
};

export default Header;
