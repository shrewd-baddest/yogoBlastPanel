import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useRouteError } from "react-router-dom";

const Error = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  const errorRef = useRef(null);

  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [direction, setDirection] = useState("right");
  useEffect(() => {
    const interval = setInterval(() => {
      if (!errorRef.current) return;

      const rect = errorRef.current.getBoundingClientRect();
      const maxX = window.innerWidth - rect.width;
      const maxY = window.innerHeight - rect.height;

      if (direction === "right") {
        setX((prev) => {
          if (prev >= maxX) {
            setDirection("left");

            // Move down ONLY when hitting edge
            setY((prevY) => (prevY >= maxY ? 0 : prevY + 20));

            return prev;
          }
          return prev + 5;
        });
      } else {
        setX((prev) => {
          if (prev <= 0) {
            setDirection("right");

            // Move down ONLY when hitting edge
            setY((prevY) => (prevY >= maxY ? 0 : prevY + 20));

            return prev;
          }
          return prev - 5;
        });
      }
    }, 50);

    return () => clearInterval(interval);
  }, [direction]);

  return (
    <div
      ref={errorRef}
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
      }}
      className="errorDiv"
    >
      <h3>An Error has occurred.</h3>
      <p>{error?.message}</p>
      <button onClick={() => navigate("/home")}>Go to Home Page</button>
    </div>
  );
};

export default Error;
