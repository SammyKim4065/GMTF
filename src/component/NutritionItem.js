import React from "react";
import styleClass from "../css/ItemNutrition.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NutritionItem = (props) => {
  const isTitle =
    props.title != null ? (
      <p className={styleClass.title}>{props.title}</p>
    ) : (
      <FontAwesomeIcon
        className={styleClass.icon}
        icon={props.icon}
      ></FontAwesomeIcon>
    );

  return (
    <div className={styleClass.content}>
      {isTitle}
      <div className={styleClass.box}>
        <p>{props.content}</p>
      </div>
    </div>
  );
};

export default NutritionItem;
