import { useEffect, useState } from "react";
import styleClass from "../css/CalendarItem.Module.css";

export default function CalendarItem({
  amountDateOfMonth,
  activeDate,
  date,
  onItemClicked,
}) {
  const [isActiveDate, setIsActiveDate] = useState(false);

  useEffect(() => {
    setIsActiveDate(false);
    activeDate.forEach((element) => {
      parseInt(element) === amountDateOfMonth && setIsActiveDate(true);
    });
  }, [activeDate, amountDateOfMonth]);
  return (
    <>
      <button
        onClick={() => onItemClicked(amountDateOfMonth, date)}
        className={`${
          isActiveDate
            ? styleClass.activeDate
            : amountDateOfMonth === ""
            ? styleClass.displayNone
            : styleClass.dateBox
        }`}
      >
        <p style={{ fontSize: "2vw" }}>{amountDateOfMonth}</p>
      </button>
    </>
  );
}
