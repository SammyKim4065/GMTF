import { Route, Switch, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./component/Header";
import Dashboard from "./component/Dashboard";
import DetailFood from "./component/DetailFood";
import Welcome from "./component/Welcome";
import MealPlanning from "./component/MealPlanning";
import styleClass from "./css/Header.module.css";

function App() {
  const [valueSearch, setvalueSearch] = useState("");
  const [isActiveHeader, setIsActiveHeader] = useState(false);
  const [isTextLogo, setIsTextLogo] = useState(false);
  const location = useLocation();

  const updateSearch = (props) => {
    setvalueSearch(props);
  };

  const clearSearch = () => setvalueSearch("");

  useEffect(() => {
    switch (location.pathname) {
      case "/":
        setIsActiveHeader(true);
        break;
      case "/mealPlanning":
        setIsTextLogo(true);
        break;
      default:
        setIsActiveHeader(false);
        setIsTextLogo(false);
        break;
    }
  }, [location.pathname]);

  return (
    <div>
      <div>
        <svg className={styleClass.headerBg} viewBox="0 0 790.4 230.1">
          <path
            opacity="0.83"
            fill="#AA815C"
            d="M785.4,50.4l-0.2-47H153L0.4,3v113.3c0,0,80.8-68.3,142.7,0s127.2-4.8,127.2-4.8
	s68.1-84.7,170.1,7.1c56.6,51,116.2-34.2,159-29.5c57.5,6.3,75.2,104.8,146.1,83.9c34.1-10,39.9-76.5,39.7-122.5H785.4z"
          />
          <g>
            <g>
              <path
                opacity="0.83"
                fill="#AA815C"
                d="M69.2,230.1L69.2,230.1c-7.8,0-14.1-6.4-14.1-14.1V87.1C55,79.4,61.4,73,69.2,73h0
			c7.8,0,14.1,6.4,14.1,14.1V216C83.3,223.8,76.9,230.1,69.2,230.1z"
              />
            </g>
            <path
              fill="#F7DA61"
              d="M74.2,211.1L74.2,211.1c-7.8,0-14.1-6.4-14.1-14.1V68.1C60,60.4,66.4,54,74.2,54h0
		c7.8,0,14.1,6.4,14.1,14.1V197C88.3,204.8,81.9,211.1,74.2,211.1z"
            />
          </g>
          <g>
            <path
              opacity="0.83"
              fill="#AA815C"
              d="M511,175.8L511,175.8c-5.7,0-10.3-4.6-10.3-10.3V83.3c0-5.7,4.6-10.3,10.3-10.3h0
		c5.7,0,10.3,4.6,10.3,10.3v82.1C521.3,171.1,516.7,175.8,511,175.8z"
            />
            <path
              fill="#F7DA61"
              d="M516,156.8L516,156.8c-5.7,0-10.3-4.6-10.3-10.3V64.3c0-5.7,4.6-10.3,10.3-10.3l0,0
		c5.7,0,10.3,4.6,10.3,10.3v82.1C526.3,152.1,521.7,156.8,516,156.8z"
            />
          </g>
          <g>
            <path
              opacity="0.83"
              fill="#AA815C"
              d="M322.8,149.4L322.8,149.4c-7.3,0-13.3-6-13.3-13.3V58.7c0-7.3,6-13.3,13.3-13.3l0,0
		c7.3,0,13.3,6,13.3,13.3v77.4C336.1,143.4,330.1,149.4,322.8,149.4z"
            />
            <path
              fill="#F7DA61"
              d="M327.8,130.4L327.8,130.4c-7.3,0-13.3-6-13.3-13.3V39.7c0-7.3,6-13.3,13.3-13.3l0,0c7.3,0,13.3,6,13.3,13.3
		v77.4C341.1,124.4,335.1,130.4,327.8,130.4z"
            />
          </g>
          <g>
            <path
              opacity="0.83"
              fill="#AA815C"
              d="M355.6,194.8L355.6,194.8c-6,0-10.9-4.9-10.9-10.9V76.3c0-6,4.9-10.9,10.9-10.9l0,0
		c6,0,10.9,4.9,10.9,10.9v107.7C366.5,189.9,361.6,194.8,355.6,194.8z"
            />
            <path
              fill="#F7DA61"
              d="M360.6,175.8L360.6,175.8c-6,0-10.9-4.9-10.9-10.9V57.3c0-6,4.9-10.9,10.9-10.9l0,0c6,0,10.9,4.9,10.9,10.9
		v107.7C371.5,170.9,366.6,175.8,360.6,175.8z"
            />
          </g>
          <g>
            <path
              opacity="0.83"
              fill="#AA815C"
              d="M242,191.3L242,191.3c-6,0-10.9-4.9-10.9-10.9V72.8c0-6,4.9-10.9,10.9-10.9h0
		c6,0,10.9,4.9,10.9,10.9v107.7C252.9,186.4,248,191.3,242,191.3z"
            />
            <path
              fill="#F7DA61"
              d="M247,172.3L247,172.3c-6,0-10.9-4.9-10.9-10.9V53.8c0-6,4.9-10.9,10.9-10.9h0c6,0,10.9,4.9,10.9,10.9v107.7
		C257.9,167.4,253,172.3,247,172.3z"
            />
          </g>
          <g>
            <path
              opacity="0.83"
              fill="#AA815C"
              d="M777.8,211.1L777.8,211.1c-4,0-7.3-3.3-7.3-7.3V65.7c0-4,3.3-7.3,7.3-7.3h0
		c4,0,7.3,3.3,7.3,7.3v138.1C785.1,207.8,781.8,211.1,777.8,211.1z"
            />
            <path
              fill="#F7DA61"
              d="M782.8,192.1L782.8,192.1c-4,0-7.3-3.3-7.3-7.3V46.7c0-4,3.3-7.3,7.3-7.3h0c4,0,7.3,3.3,7.3,7.3v138.1
		C790.1,188.8,786.8,192.1,782.8,192.1z"
            />
          </g>
          <g>
            <path
              opacity="0.83"
              fill="#AA815C"
              d="M7.3,206.5L7.3,206.5c-4,0-7.3-3.3-7.3-7.3L0,61c0-4,3.3-7.3,7.3-7.3h0c4,0,7.3,3.3,7.3,7.3
		v138.1C14.7,203.2,11.4,206.5,7.3,206.5z"
            />
            <path
              fill="#F7DA61"
              d="M12.3,187.5L12.3,187.5c-4,0-7.3-3.3-7.3-7.3V42c0-4,3.3-7.3,7.3-7.3h0c4,0,7.3,3.3,7.3,7.3v138.1
		C19.7,184.2,16.4,187.5,12.3,187.5z"
            />
          </g>
          <g>
            <path
              opacity="0.83"
              fill="#AA815C"
              d="M623.9,134.7L623.9,134.7c-6.1,0-11.1-5-11.1-11.1V57.8c0-6.1,5-11.1,11.1-11.1l0,0
		c6.1,0,11.1,5,11.1,11.1v65.8C635.1,129.7,630.1,134.7,623.9,134.7z"
            />
            <path
              fill="#F7DA61"
              d="M628.9,115.7L628.9,115.7c-6.1,0-11.1-5-11.1-11.1V38.8c0-6.1,5-11.1,11.1-11.1l0,0c6.1,0,11.1,5,11.1,11.1
		v65.8C640.1,110.7,635.1,115.7,628.9,115.7z"
            />
          </g>

          <path
            fill="#F7DA61"
            d="M790.4,42.9l-0.2-42.5H158L5.4,0v102.8c0,0,80.8-62,142.7,0s127.2-4.4,127.2-4.4s68.1-76.9,170.1,6.4
	c56.6,46.3,116.2-31,159-26.7c57.5,5.7,75.2,95,146.1,76.1c34.1-9.1,39.9-69.4,39.7-111.2L790.4,42.9z"
          />
        </svg>

        <Header
          style={styleClass.headerAbsolute}
          updateSearch={updateSearch}
          valueSearch={valueSearch}
          isHidden={isActiveHeader}
          isTextLogo={isTextLogo}
        />
      </div>

      <Switch>
        <Route exact path="/">
          <Welcome />
        </Route>
        <Route exact path="/dashboard">
          <Dashboard
            valueSearch={valueSearch}
            clearSearch={clearSearch}
            isHidden={isActiveHeader}
          />
        </Route>

        <Route path="/detail/:foodId">
          <DetailFood />
        </Route>

        <Route path="/mealPlanning">
          <MealPlanning />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
