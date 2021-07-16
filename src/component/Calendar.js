import React from "react";
import styleClass from "../css/CustomCalendar.Module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
const Calendar = ({
  month,
  monthString,
  year,
  nextMonthHandler,
  backMonthHandler,
}) => {
  return (
    <div className={styleClass.calendarRoot}>
      <p className={styleClass.yearText}>{year}</p>
      <div className={styleClass.monthBox}>
        <FontAwesomeIcon
          icon={faAngleLeft}
          className={styleClass.icon}
          onClick={() => backMonthHandler({ date: new Date(year, month, 0) })}
        />
        <p className={styleClass.monthText}>{monthString}</p>
        <FontAwesomeIcon
          icon={faAngleRight}
          className={styleClass.icon}
          onClick={() => nextMonthHandler({ date: new Date(year, month, 0) })}
        />
      </div>
    </div>
  );
};

export default Calendar;
