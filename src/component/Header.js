import { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faSearch,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import Cardview from "./Cardview";
import styleClass from "../css/Header.module.css";
import { useHistory } from "react-router-dom";

const Header = (props) => {
  const inputRef = useRef();
  const history = useHistory();
  const [isActiveSearchBar, setIsActiveSearchBar] = useState(false);
  const isHidden = props.isHidden;

  const updateFoodInput = () => {
    const input = inputRef.current.value;
    if (!!input) {
      props.updateSearch(input);
      history.push("/dashboard");
      setIsActiveSearchBar(true);
    } else setIsActiveSearchBar(false);
  };

  const logOutHandler = () => {
    localStorage.removeItem("userHash");
    localStorage.removeItem("username");
    history.push("/");
  };

  const onMealPlanningClick = () => {
    history.push("/mealPlanning");
  };

  const onHomeClick = () => {
    history.push("/dashboard");
  };

  useEffect(() => {
    const search = props.valueSearch;
    if (search === "") {
      inputRef.current.value = search;
      setIsActiveSearchBar(false);
    }
  }, [props.valueSearch, props.isHidden]);

  return (
    <>
      <div
        className={`${isHidden ? styleClass.displayNone : styleClass.display}`}
      >
        <div className={styleClass.gridContainer}>
          <Cardview
            styleClass={`${styleClass.cardview}`}
            onPropsClick={onHomeClick}
          >
            <FontAwesomeIcon icon={faHome} />
          </Cardview>

          <Cardview
            styleClass={`${
              isActiveSearchBar
                ? styleClass.searchInvalid
                : styleClass.searchValid
            }`}
          >
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              placeholder="Fill the food"
              ref={inputRef}
              onChange={updateFoodInput}
            ></input>
          </Cardview>

          <div />
          <Cardview
            styleClass={`${styleClass.shoppingIcon}`}
            onPropsClick={onMealPlanningClick}
          >
            <p className={styleClass.mealPlanningText}>MEAL PLANNING</p>
          </Cardview>

          <Cardview
            styleClass={`${styleClass.cardview}`}
            onPropsClick={logOutHandler}
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
          </Cardview>
        </div>
      </div>
    </>
  );
};

export default Header;
