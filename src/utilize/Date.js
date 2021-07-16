import { useReducer, useEffect } from "react";

export const week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const SelectDateHandler = ({ _meal, otherDate }) => {
  const selectedDate = _meal.filter(
    (item) =>
      new Date(
        datePattern(item[0][0]).getFullYear(),
        datePattern(item[0][0]).getMonth()
      ) -
        new Date(otherDate.getFullYear(), otherDate.getMonth()) ===
      0
  );
  return selectedDate.length !== 0
    ? selectedDate[0]
    : [[`0-${otherDate.getMonth()}-${otherDate.getFullYear()}`, null]];
};

const datePattern = (string) => {
  const dateString = string.split("-");
  return new Date(dateString[2], dateString[1], dateString[0]);
};

export const sortAndGroupDate = (value) => {
  value.sort((a, b) => {
    const dateA = a[0].split("-");
    const dateB = b[0].split("-");

    return (
      new Date(dateA[2], dateA[1], dateA[0]) -
      new Date(dateB[2], dateB[1], dateB[0])
    );
  });

  const list = [];
  let prev_Month = [];
  value.forEach((element) => {
    const month = element[0].split("-");

    if (list.length === 0) {
      prev_Month = month[1];
      list.push([element]);
    } else {
      if (prev_Month === 0) {
        prev_Month = month[1];
        list.push([element]);
      } else {
        if (prev_Month === month[1]) {
          list[list.length - 1].push(element);
        } else {
          list.push([element]);
          prev_Month = month[1];
        }
      }
    }
  });
  return list;
};

export const firstDateInCalendar = ({ weekDateFirstOfMonth }) => {
  switch (weekDateFirstOfMonth) {
    case week[0]:
      return 0;

    case week[1]:
      return 1;

    case week[2]:
      return 2;

    case week[3]:
      return 3;

    case week[4]:
      return 4;

    case week[5]:
      return 5;

    case week[6]:
      return 6;
    default:
      return 0;
  }
};

export const ReducerDate = ({ dateMeals }) => {
  const dateSplitHandler = (value) => {
    const date = value.split("-");
    return date[0];
  };

  const monthYearSplitHandler = (value) => {
    const date = value[0].split("-");
    const month = date[1];
    const year = date[2];
    return { month: parseInt(month) + 1, year: year };
  };

  const dateHandler = (date) => {
    const monthYear = monthYearSplitHandler(date[0]);
    const activeDate = date.map((item) => dateSplitHandler(item[0]));
    const monthString = toMonthString(new Date(0, monthYear.month, 0));
    const lastDateOfMonth = new Date(monthYear.year, monthYear.month, 0);
    const weekDateFirstOfMonth = toWeekDay(
      new Date(monthYear.year, monthYear.month, 1)
    );
    return {
      activeDate,
      lastDateOfMonth: lastDateOfMonth.getDate(),
      weekDateFirstOfMonth: weekDateFirstOfMonth,
      monthString: monthString,
      monthNumber: monthYear.month,
      year: monthYear.year,
    };
  };

  const dateReducer = (state, action) => {
    switch (action.type) {
      case "INSERT_DATE":
        const dateObj = dateHandler(action.date);
        return {
          activeDates: dateObj.activeDate,
          lastDateOfMonth: dateObj.lastDateOfMonth,
          weekDateFirstOfMonth: dateObj.weekDateFirstOfMonth,
          monthString: dateObj.monthString,
          monthNumber: dateObj.monthNumber,
          year: dateObj.year,
        };

      default:
        return {
          activeDates: [],
          weekDateFirstOfMonth: "",
          lastDateOfMonth: 0,
          monthString: "",
          monthNumber: 0,
        };
    }
  };

  const [dateState, dateDispatch] = useReducer(dateReducer, {
    activeDates: [],
    weekDateFirstOfMonth: "",
    lastDateOfMonth: 0,
    monthString: "",
    monthNumber: 0,
  });

  useEffect(() => {
    dateDispatch({ type: "INSERT_DATE", date: dateMeals });
  }, [dateMeals]);

  return dateState;
};

export const toMonthString = (date) => {
  return date.toLocaleString("en-us", {
    month: "long",
  });
};

export const toWeekDay = (date) => {
  return date.toLocaleString("en-us", {
    weekday: "short",
  });
};
