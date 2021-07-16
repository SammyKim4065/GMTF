import React from "react";
import CalendarItem from "./CalendarItem.js";
import styleClass from "../css/CustomCalendar.Module.css";
import Calendar from "./Calendar.js";
import { week, ReducerDate, firstDateInCalendar } from "../utilize/Date.js";

const CalendarCustom = ({ date, nextMonthHandler, backMonthHandler }) => {
  const dateReducer = ReducerDate({ dateMeals: date });
  const weekDateFirstOfMonth = dateReducer.weekDateFirstOfMonth.toString();
  const firstDate = firstDateInCalendar({ weekDateFirstOfMonth });

  return (
    <>
      <Calendar
        month={dateReducer.monthNumber}
        year={dateReducer.year}
        monthString={dateReducer.monthString}
        nextMonthHandler={nextMonthHandler}
        backMonthHandler={backMonthHandler}
      />
      <div>
        <div className={styleClass.container}>
          {week.map((item, index) => (
            <p
              style={{ fontSize: "1.5vw" }}
              key={index}
              className={styleClass.weekItem}
            >
              {item}
            </p>
          ))}

          {[...Array(firstDate).keys()].map((i) => (
            <CalendarItem key={i} amountDateOfMonth={""} activeDate={[]} />
          ))}

          {[...Array(dateReducer.lastDateOfMonth).keys()].map((i) => (
            <CalendarItem
              key={i}
              amountDateOfMonth={i + 1}
              date={date}
              activeDate={dateReducer.activeDates}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default CalendarCustom;
