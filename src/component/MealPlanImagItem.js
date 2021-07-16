import React, { useCallback, useState } from "react";
import stlyeClass from "../css/ImageMealPlanItem.Module.css";
import { useWindowWidth, useWindowHeight } from "@react-hook/window-size";

export default function MealPlanWithDateItem({
  value,
  index,
  date,
  id,
  onDeleteHandler,
  onModalHandler,
}) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const screenWidth = useWindowWidth();
  const screenHeight = useWindowHeight();

  const imageRef = useCallback(
    (node) => {
      if (node !== null) {
        setWidth((node.getBoundingClientRect().width * 115) / 100);
        setHeight((node.getBoundingClientRect().height * -50) / 100);
      }
    },
    [screenWidth, screenHeight]
  );

  return (
    <div
      style={{
        display: "grid",
        marginTop: "1vw",
      }}
    >
      <div key={index} className={`${stlyeClass.imageContainer}`}>
        <img
          alt="icondelete"
          onClick={() => onDeleteHandler(date, id)}
          className={stlyeClass.deleteIcon}
          style={{
            transform: `translate(${width}px,${height}px)`,
          }}
          src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMzg1LjAyNCAzODUuMDI0IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAzODUuMDI0IDM4NS4wMjQ7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnPg0KCTxnPg0KCQk8cGF0aCBkPSJNMTkyLjUxMiwwQzg2LjUyOCwwLDAsODYuNTI4LDAsMTkyLjUxMnM4Ni41MjgsMTkyLjUxMiwxOTIuNTEyLDE5Mi41MTJzMTkyLjUxMi04Ni41MjgsMTkyLjUxMi0xOTIuNTEyDQoJCQlTMjk4LjQ5NiwwLDE5Mi41MTIsMHogTTI1OC41NiwyMTguMTEySDEyNS40NHYtNDAuOTZoMTMzLjEyVjIxOC4xMTJ6Ii8+DQoJPC9nPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo="
        />

        <img
          alt="foodimg"
          className={stlyeClass.foodImage}
          src={value.image}
          ref={imageRef}
          onClick={() => onModalHandler(value)}
        />
      </div>
      <section
        style={{
          width: "100%",
          textAlign: "center",
          fontSize: "1.5vh",
          textJustify: "auto",
          display: "flex",
          margin: "0",
          justifyContent: "center",
        }}
      >
        <p style={{ width: "80%", fontSize: "1vw" }}>{value.name}</p>
      </section>
    </div>
  );
}
