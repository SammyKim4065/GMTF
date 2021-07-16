import { useRef, useState, useReducer, useEffect, useCallback } from "react";
import styleClass from "../css/Welcome.module.css";
import isEmail from "validator/es/lib/isEmail";
import { apiKey, includeNutrition } from "../utilize/api";
import { useHistory } from "react-router-dom";
import firebase from "../utilize/Firebase.js";
import { primaryColor, secondColor } from "../utilize/color.js";

const Welcome = () => {
  const bcrypt = require("bcryptjs");
  const history = useHistory();

  const usernameRef = useRef("");
  const lastnameRef = useRef("");
  const emailRef = useRef("");
  const passRef = useRef("");
  const loginContainerRef = useRef("");

  const USERNAME_ERR_MESSAGE = "Please enter your username";
  const EMAIL_ERR_MESSAGE = "Please enter your email";
  const EMAIL_INCORRECT_ERR_MESSAGE = "Incorrect email, please try again";
  const LASTNAME_ERR_MESSAGE = "Please enter your lastname";
  const PASSWORD_ERR_MESSAGE = "Please enter your password";
  const USER_NOT_EXISTS = "User not exists, please try again";

  const [actionMessage, setActionMessage] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const userRef = firebase.database().ref("User");

  const changeStyleClass = (ref, errMessage) => {
    if (!!ref.current.value) {
      ref.current.className = `${styleClass.usernameContainer} ${styleClass.box}`;
      ref.current.style.color = "white";
      ref.current.style.borderColor = primaryColor;
      ref.current.style.backgroundColor = secondColor;
    } else {
      ref.current.className = styleClass.inValid;
      ref.current.style.backgroundColor = "brown";
      ref.current.placeholder = errMessage;
    }
  };

  const usernameReducer = (state, action) => {
    switch (action.type) {
      case "INPUT_USERNAME":
        changeStyleClass(usernameRef, USERNAME_ERR_MESSAGE);
        return {
          value: action.val,
          isValid: !!action.val,
        };

      default:
        return {
          value: action.val,
          isValid: !!action.val,
        };
    }
  };

  const lastnameReducer = (state, action) => {
    switch (action.type) {
      case "INPUT_LASTNAME":
        changeStyleClass(lastnameRef, LASTNAME_ERR_MESSAGE);
        return {
          value: action.val,
          isValid: !!action.val,
        };

      default:
        return {
          value: action.val,
          isValid: !!action.val,
        };
    }
  };

  const emailReducer = (state, action) => {
    switch (action.type) {
      case "INPUT_EMAIL":
        changeStyleClass(emailRef, EMAIL_ERR_MESSAGE);
        return {
          value: action.val,
          isValid: !!action.val ? (isEmail(action.val) ? true : false) : false,
        };

      default:
        return {
          value: action.val,
          isValid: !!action.val,
        };
    }
  };

  const passReducer = (state, action) => {
    switch (action.type) {
      case "INPUT_PASS":
        changeStyleClass(passRef, PASSWORD_ERR_MESSAGE);
        return {
          value: action.val,
          isValid: !!action.val,
        };

      default:
        return {
          value: action.val,
          isValid: !!action.val,
        };
    }
  };

  const [usernameState, nameDisp] = useReducer(usernameReducer, {
    value: "",
    isValid: false,
    errMessage: "",
  });

  const [lastnameState, lastNDisp] = useReducer(lastnameReducer, {
    value: "",
    isValid: false,
    errMessage: "",
  });

  const [emailState, emailDisp] = useReducer(emailReducer, {
    value: "",
    isValid: false,
    errMessage: "",
  });

  const [passState, passDisp] = useReducer(passReducer, {
    value: "",
    isValid: false,
    errMessage: "",
  });

  const onRegisterCliked = useCallback(() => {
    const username = usernameRef.current.value;
    const lastname = lastnameRef.current.value;
    const email = emailRef.current.value;
    const password = passRef.current.value;

    dispatchUser(username, lastname, email, password);
  }, []);

  const registerValidate = () => {
    if (
      usernameState.isValid &&
      lastnameState.isValid &&
      emailState.isValid &&
      passState.isValid
    ) {
      RegisterUser({
        username: usernameState.value,
        lastname: lastnameState.value,
        email: emailState.value,
        password: bcrypt.hashSync(passState.value, bcrypt.genSaltSync()),
      });
    } else {
      if (emailState.value !== "" && !emailState.isValid)
        setActionMessage(EMAIL_INCORRECT_ERR_MESSAGE);
    }
  };

  async function RegisterUser(user) {
    const response = await fetch(
      "https://api.spoonacular.com/users/connect?" +
        "apiKey=" +
        apiKey +
        "&" +
        includeNutrition +
        "=true",
      {
        method: "POST",
        body: JSON.stringify(user),
        header: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (data.status === "failure") {
      setActionMessage("Register failed, please try again");
    } else {
      localStorage.setItem("userHash", data.hash);
      localStorage.setItem("username", user.username);
      postUsertoFirebase(user, data);
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        history.push("/dashboard");
      }, 3000);
    }
  }

  function postUsertoFirebase(user, data) {
    const userObj = {
      userInfo: user,
      hash: data.hash,
      usernameHash: data.username,
    };
    userRef.push(userObj);
  }

  const isLoggin = () => {
    !!localStorage.getItem("userHash") && history.push("/dashboard ");
  };

  const onLoginCliked = useCallback(() => {
    const username = usernameRef.current.value;
    const password = passRef.current.value;

    nameDisp({
      type: "INPUT_USERNAME",
      val: username,
    });

    passDisp({
      type: "INPUT_PASS",
      val: password,
    });
  }, []);

  const loginValidate = () => {
    if (usernameState.isValid && passState.isValid) {
      userRef.on("value", (snapshot) => {
        const convertData = Object.values(snapshot.val());
        const validated = convertData.find((item) => {
          return validateUser(
            item.userInfo.username,
            item.userInfo.password,
            usernameState.value,
            passState.value,
            item.hash
          );
        });

        validated
          ? successLogin(validated.hash, validated.userInfo.username)
          : setActionMessage(USER_NOT_EXISTS);
      });
    }
  };

  const successLogin = (hash, username) => {
    if (localStorage.getItem("userHash") === null) {
      saveUserInfoLocalStorage(hash, username);
    }
    setIsLoading(true);

    setTimeout(() => {
      history.push("/dashboard");
      setIsLoading(false);
    }, 3000);
  };

  const saveUserInfoLocalStorage = (hash, username) => {
    localStorage.setItem("userHash", hash);
    localStorage.setItem("username", username);
  };

  const validateUser = (
    existsUsername,
    existsPassword,
    inputUsername,
    inputPassword
  ) => {
    const validated =
      inputUsername === existsUsername &&
      bcrypt.compareSync(inputPassword, existsPassword);

    return validated;
  };

  const dispatchUser = (username, lastname, email, pass) => {
    nameDisp({
      type: "INPUT_USERNAME",
      val: username,
    });
    lastNDisp({
      type: "INPUT_LASTNAME",
      val: lastname,
    });
    emailDisp({
      type: "INPUT_EMAIL",
      val: email,
    });
    passDisp({
      type: "INPUT_PASS",
      val: pass,
    });
  };

  const usernameChanged = () =>
    changeStyleClass(usernameRef, USERNAME_ERR_MESSAGE);

  const lastnameChanged = () =>
    changeStyleClass(lastnameRef, LASTNAME_ERR_MESSAGE);

  const emailChanged = () => changeStyleClass(emailRef, EMAIL_ERR_MESSAGE);

  const passChange = () => changeStyleClass(passRef, PASSWORD_ERR_MESSAGE);

  const inputLayout = (
    style,
    placeholder,
    userState,
    userRef,
    typeInput,
    onChanged
  ) => (
    <div className={style}>
      <input
        style={{
          color: "white",
          borderColor: primaryColor,
          backgroundColor: secondColor,
        }}
        onChange={onChanged}
        placeholder={placeholder}
        ref={userRef}
        type={typeInput}
      ></input>
    </div>
  );

  useEffect(() => {
    isLoggin();
  }, []);

  useEffect(() => {
    isRegister ? registerValidate() : loginValidate();
  }, [usernameState, passState, emailState, lastnameState, isRegister]);

  return (
    <div className={styleClass.container}>
      <div className={styleClass.bg}>
        <img src="/img/dotbg.png" alt="dotbg"></img>
      </div>
      <div className={styleClass.textLogoContainer} ref={loginContainerRef}>
        <div>
          <p
            className={styleClass.mainText}
            style={{ transform: "translateY(25%)" }}
          >
            <span>G</span>
            <span>I</span>
            <span>V</span>
            <span>E</span>
            <span> </span>
            <span>M</span>
            <span>E</span>
          </p>

          <p
            className={styleClass.mainText}
            style={{ transform: "translateY(-25%)" }}
          >
            <span>T</span>
            <span>H</span>
            <span>E</span>

            <span> </span>
            <span>F</span>
            <span>O</span>
            <span>O</span>
            <span>D</span>
          </p>
        </div>

        <div className={styleClass.loginContainer}>
          <div
            className={styleClass.burgerBox}
            style={{ transform: "translateY(-5%)" }}
          >
            <img
              className={styleClass.topBurger}
              alt="topBurger"
              src="/img/burgerTop.png"
            ></img>

            {inputLayout(
              `${styleClass.usernameContainer} ${styleClass.box}`,
              "USERNAME",
              usernameState,
              usernameRef,
              "text",
              usernameChanged
            )}

            {isRegister &&
              inputLayout(
                `${
                  isRegister
                    ? styleClass.emailContainer
                    : styleClass.displayNone
                }`,
                "EMAIL",
                emailState,
                emailRef,
                "text",
                emailChanged
              )}

            {isRegister &&
              inputLayout(
                `${
                  isRegister
                    ? styleClass.emailContainer
                    : styleClass.displayNone
                }`,
                "LASTNAME",
                lastnameState,
                lastnameRef,
                "text",
                lastnameChanged
              )}

            {inputLayout(
              `${styleClass.passContainer} ${styleClass.box}`,
              "PASSWORD",
              passState,
              passRef,
              "password",
              passChange
            )}

            <img
              alt="bottomBurger"
              className={styleClass.bottomBurger}
              style={{ zIndex: "-1", transform: "translateY(-2%)" }}
              src="/img/burgerBottomTwo.png"
            ></img>
          </div>

          <p
            className={styleClass.loginText}
            onClick={isRegister ? onRegisterCliked : onLoginCliked}
          >
            {isRegister ? "REGISTER" : "LOGIN"}
          </p>

          {actionMessage === "" ? (
            <div>
              {!isRegister && (
                <p style={{ fontSize: "1vw" }}>
                  Have you ever have an accout ?
                </p>
              )}
              <p
                onClick={() => setIsRegister(!isRegister)}
                style={{
                  marginTop: "0px",
                  color: "rgb(184, 90, 23)",
                  fontSize: "1.2vw",
                }}
              >
                {isRegister ? "Login" : "Click here!"}
              </p>
            </div>
          ) : (
            <p style={{ color: "red", fontSize: "1vw" }}>{actionMessage}</p>
          )}
        </div>
      </div>
      <div className={`${isLoading ? styleClass.show : styleClass.hide}`}>
        <div className={styleClass.welcome}>
          <svg viewBox="0 0 746.2 202.7">
            <path
              fill="#EFCE9E"
              d="M48.7,202.7c-1.6,0-3.6-0.2-6.1-0.7c-2.5-0.5-5-1.4-7.6-2.8c-2.6-1.4-4.6-3.4-6.2-6.2
		c-1.6-2.8-2.4-6.4-2.4-10.9c0-4.5,1-10.4,2.9-17.9c1.9-7.4,4.8-17.2,8.6-29.2c2.7-9.1,5.4-18.3,8.2-27.6c2.7-9.3,5-18.8,6.8-28.4
		c1.8-9.7,2.8-19.6,2.8-29.9c0-6.4-0.4-12-1.1-16.7c-0.7-4.7-2.1-8.4-4.2-10.9c-2.1-2.6-5.2-3.8-9.4-3.8c-4,0-7.5,1.1-10.4,3.4
		c-3,2.2-5.4,5.2-7.4,8.9c-2,3.7-3.4,7.7-4.3,12c-0.9,4.3-1.3,8.6-1.3,12.7c0,6.4,1,11.8,3.1,16.1c-7.4,0-12.6-1.8-15.8-5.4
		C1.6,61.7,0,57.2,0,52c0-4.8,1.2-9.7,3.6-14.8s5.7-9.7,9.8-13.9c4.2-4.2,9-7.7,14.5-10.3c5.5-2.6,11.4-4,17.6-4
		c10.6,0,18.5,4,23.9,11.9c5.4,7.9,8,18.9,8,33C77.5,65.2,76,77,73,89.3c-3,12.2-6.7,25.2-11,38.8c-1.9,6.1-4,12.4-6.2,18.8
		c-2.2,6.5-4.2,12.9-5.8,19.3c-1.6,6.4-2.4,12.5-2.4,18.2c0,3,0.4,5.2,1.2,6.6c0.8,1.4,2.4,2,4.8,2c4.2,0,8.7-1.9,13.6-5.6
		c4.9-3.8,9.8-8.8,14.9-15c5-6.2,9.8-13.2,14.4-21c4.6-7.8,8.8-15.7,12.7-23.8c3.9-8.1,7.2-15.8,9.7-23c2.6-7.3,4.2-13.6,5-19.1
		c5.8,0,10.1,1.6,13.1,4.7c3,3.1,4.4,6.1,4.4,9c0,1.9-0.8,5-2.4,9.4c-1.6,4.3-3.9,10.1-7,17.3c-2.6,5.9-5.2,12.2-7.8,19
		c-2.6,6.7-4.8,13.4-6.6,20c-1.8,6.6-2.6,12.8-2.6,18.6c0,3.2,0.4,5.6,1.2,7.2c0.8,1.6,2.5,2.4,5,2.4c4.5,0,9.7-2.2,15.6-6.7
		c5.9-4.5,12-10.6,18.2-18.2c6.2-7.7,12.3-16.4,18.2-26c5.9-9.7,11.3-19.7,16.1-30.1c4.8-10.4,8.6-20.6,11.5-30.7
		c2.9-10.1,4.3-19.4,4.3-27.8c0-8.5-1.4-14.6-4.3-18.2c-2.9-3.7-6.6-6.2-11-7.7c2.7-4.5,5.6-7.7,8.5-9.7c3-2,5.6-3,8-3
		c3.7,0,7.4,2.3,11,6.8c3.7,4.6,5.5,11.7,5.5,21.5c0,8.6-1.6,18.5-4.9,29.6c-3.3,11.1-7.8,22.6-13.4,34.6
		c-5.7,11.9-12.2,23.6-19.4,34.9c-7.3,11.4-15,21.6-23,30.7c-8.1,9.1-16.2,16.4-24.2,21.7c-8.1,5.4-15.7,8-22.9,8
		c-3.8,0-7.4-0.8-10.7-2.3c-3.3-1.5-5.9-3.8-7.8-6.7c-1.9-3-2.9-6.5-2.9-10.7c0-2.1,0.3-4.4,1-7.1c0.6-2.6,1.4-5.4,2.2-8.3
		c-7.8,10.4-15.8,18.8-24,25.3C64.6,199.4,56.6,202.7,48.7,202.7z"
            />
            <path
              fill="#EFCE9E"
              d="M233.8,192.4c-10.1,0-17.8-2.7-23-8.2c-5.3-5.4-7.9-12.2-7.9-20.4c0-7.2,1.8-14.8,5.4-22.7
		c3.6-7.9,8.4-15.4,14.5-22.3c6.1-7,12.8-12.6,20-17c7.3-4.4,14.5-6.6,21.7-6.6c4,0,7.8,1,11.4,3.1c3.6,2.1,5.4,6.2,5.4,12.5
		c0,6.1-1.8,11.8-5.4,17.2c-3.6,5.4-8.3,10.1-14.2,14.3c-5.8,4.2-12.3,7.6-19.4,10.2c-7.1,2.6-14.2,4.3-21.2,4.9
		c-0.2,1-0.3,1.9-0.5,2.9c-0.2,1-0.2,2.2-0.2,3.8c0,1.3,0.2,3,0.6,5.2c0.4,2.2,1.2,4.3,2.4,6.5c1.2,2.2,3.1,4,5.6,5.4
		c2.6,1.4,5.9,2.2,10.1,2.2c6.7,0,13.5-1.9,20.3-5.8c6.8-3.8,13.2-8.9,19.1-15.2c5.9-6.3,10.9-13.3,14.9-21l4.1,3.4
		c-4.3,9.6-9.8,18-16.6,25.1c-6.7,7.1-14.1,12.7-22.2,16.7C250.5,190.4,242.2,192.4,233.8,192.4z M223.2,149.9
		c4.2-0.8,8.9-2.4,14.2-4.9c5.3-2.5,10.3-5.6,15.1-9.4c4.8-3.8,8.8-7.9,11.9-12.4c3.1-4.5,4.7-9,4.7-13.7c0-1.8-0.3-3-1-3.8
		c-0.6-0.8-1.8-1.2-3.4-1.2c-3.8,0-7.8,1.4-11.9,4.2c-4.1,2.8-8.1,6.4-12,10.8c-3.9,4.4-7.4,9.3-10.4,14.6
		C227.4,139.5,225,144.8,223.2,149.9z"
            />
            <path
              fill="#EFCE9E"
              d="M303.4,189c-7.4,0-12.5-2.5-15.5-7.4c-3-5-4.4-10.9-4.4-17.8c0-7.8,1.4-17,4.3-27.6
		c2.9-10.6,6.7-21.6,11.4-33.2c4.7-11.6,9.9-23,15.6-34.1c5.7-11.1,11.4-21.2,17-30.2c5.7-9,11-16.2,15.8-21.6c4.9-5.4,8.8-8,11.6-8
		c1.9,0,3.6,1,4.9,3.1c1.4,2.1,2.4,4.6,3.2,7.6c0.8,3,1.2,5.6,1.2,8c0,4.3-1.1,10-3.2,16.9s-5.2,14.6-9.1,23
		c-3.9,8.4-8.6,17-13.9,25.7c-5.4,8.7-11.2,17-17.6,25c-6.4,7.9-13.3,14.8-20.6,20.5c-0.6,4-1.2,8-1.8,12c-0.6,4-0.8,7.7-0.8,11
		c0,5.9,0.9,10.3,2.8,13.1c1.8,2.8,4.4,4.2,7.6,4.2c4.2,0,8.4-1.9,12.6-5.8c4.2-3.8,8.3-8.7,12.1-14.5c3.8-5.8,7.2-11.9,10.1-18.1
		l5,2.9c-6.7,13.9-14.2,25-22.3,33.1S312.5,189,303.4,189z M307.7,126.1c5.6-5.8,10.9-12.2,15.8-19.3c5-7.1,9.6-14.4,13.8-21.7
		c4.2-7.4,8-14.5,11.2-21.5c3.2-7,5.7-13.2,7.4-18.7c1.8-5.5,2.7-9.9,2.9-13.1c0-0.6-0.2-1.2-0.5-1.7c-1.3,0-3.4,1.9-6.4,5.6
		c-3,3.8-6.4,8.8-10.3,15.2c-3.9,6.4-8,13.8-12.1,22.1c-4.2,8.3-8.2,17-12,26.2C313.7,108.4,310.4,117.3,307.7,126.1z"
            />
            <path
              fill="#EFCE9E"
              d="M362.9,195.2c-8.2,0-14.9-2.6-20.2-7.8c-5.3-5.2-7.9-13.1-7.9-23.6c0-7.8,1.6-15.5,4.7-23
		c3.1-7.5,7.2-14.3,12.4-20.4c5.1-6.1,10.8-10.9,17-14.4c6.2-3.5,12.6-5.3,19-5.3c6.7,0,11.5,1.8,14.3,5.3c2.8,3.5,4.2,7.4,4.2,11.8
		c0,4.6-1.1,9-3.2,13c-2.2,4-5.1,6-8.8,6c-3,0-5.5-1.4-7.4-4.3c1.9-1.1,3.8-3.4,5.5-6.7c1.8-3.4,2.6-7.2,2.6-11.5
		c0-1.6-0.3-2.8-1-3.6c-0.6-0.8-1.9-1.2-3.8-1.2c-4.2,0-8.4,1.8-12.8,5.5c-4.4,3.7-8.5,8.4-12.4,14.3c-3.8,5.8-7,12-9.4,18.4
		c-2.4,6.4-3.6,12.4-3.6,18c0,4.6,1.2,8.9,3.6,12.7c2.4,3.8,7,5.8,13.7,5.8c6.2,0,12.6-1.8,19.1-5.3c6.5-3.5,12.6-8.5,18.4-14.9
		c5.8-6.4,10.3-14,13.7-22.8l4.3,3.8c-3.8,9.6-9.1,18.2-15.7,25.8c-6.6,7.6-14,13.6-22.1,18C378.9,193,370.9,195.2,362.9,195.2z"
            />
            <path
              fill="#EFCE9E"
              d="M426.7,189.5c-7,0-11.9-2.3-14.6-6.8s-4.1-9.7-4.1-15.5c0-5.1,0.8-10.3,2.4-15.6c1.6-5.3,3.8-10.2,6.5-14.9
		c2.7-4.6,5.8-8.4,9.1-11.3c3.4-2.9,6.8-4.3,10.3-4.3c1,0,2.1,0.2,3.5,0.6c1.4,0.4,2.4,0.9,3,1.6c-1.8,1.9-3.6,4.6-5.6,8.2
		c-2,3.5-3.8,7.3-5.5,11.4s-3,8.2-4.1,12.2c-1,4.1-1.6,7.8-1.6,11.2c0,3.7,0.6,6.6,1.9,8.6c1.3,2.1,3.4,3.1,6.2,3.1
		c3.2,0,7-1.7,11.4-5.2c4.4-3.4,8.6-7.6,12.6-12.6c-5-4.3-8.6-9.3-10.9-15c-2.3-5.7-3.5-12.1-3.5-19.3c0-4,0.9-8.2,2.6-12.7
		c1.8-4.5,4.5-8.2,8.2-11.3c3.7-3,8.5-4.6,14.4-4.6c6.7,0,11.4,1.9,14,5.6c2.6,3.8,4,8.3,4,13.6c0,5.9-1.6,12.6-4.7,20
		c-3.1,7.4-6.8,14.5-11.2,21.2c2.2,1.3,4.7,1.9,7.4,1.9c2.4,0,5.3-0.6,8.6-1.7c3.4-1.1,6.6-3,9.7-5.6c3.1-2.6,5.6-6.1,7.6-10.4
		l3.8,2.9c-3.4,7.8-8,13.6-13.8,17.2c-5.8,3.6-11.5,5.4-16.9,5.4c-2.1,0-4.2-0.2-6.2-0.6c-2.1-0.4-4-1-5.8-1.8
		c-5.4,6.7-11.6,12.5-18.4,17.3C440.4,187.1,433.6,189.5,426.7,189.5z M463.7,153c4-5.6,7.3-11.6,10-18.1c2.6-6.5,4-12.4,4-17.9
		c0-4-0.6-6.9-1.8-8.8c-1.2-1.8-2.8-2.8-4.9-2.8c-3.2,0-6.4,2.2-9.6,6.6c-3.2,4.4-4.8,10-4.8,16.7c0,3.8,0.6,8.1,1.8,12.8
		C459.5,146.3,461.3,150.1,463.7,153z"
            />
            <path
              fill="#EFCE9E"
              d="M618.7,189.2c-6.1,0-10.6-1.8-13.4-5.4S601,176,601,171c0-3.8,0.6-7.6,1.7-11.4c1.1-3.8,2.3-7.5,3.5-11.2
		c1.2-3.7,1.8-7,1.8-10.1c0-2.9-0.6-4.9-1.8-6c-1.2-1.1-2.6-1.7-4.2-1.7c-3.8,0-8.2,2.9-13,8.8c-4.8,5.8-10.9,14.2-18.2,25.1
		c-2.6,3.8-4.9,7.8-7,12c-2.1,4.2-4,7.8-5.8,10.8c-1.3,0-3-0.2-5.3-0.7c-2.2-0.5-4.2-1.1-5.9-1.9c-1.7-0.8-2.5-1.8-2.5-3.1
		c0-1.4,0.8-4.2,2.4-8.4c1.6-4.2,3.4-9,5.5-14.6c2.1-5.6,3.9-11.2,5.4-16.7c1.5-5.5,2.3-10.2,2.3-14c0-2.4-0.4-4.3-1.2-5.6
		c-0.8-1.4-2.2-2-4.1-2c-3.4,0-7.4,2-12.2,6.1s-9.8,9.4-15.1,16c-5.3,6.6-10.2,13.9-14.8,22c-4.6,8.1-8.3,16.1-11.2,24.1
		c-1.8,0-3.8-0.3-6.2-1c-2.4-0.6-4.5-1.4-6.2-2.4c-1.8-1-2.6-1.8-2.6-2.6c0-0.5,0.6-3,1.9-7.4c1.3-4.5,2.8-10,4.7-16.6
		c1.8-6.6,3.6-13.3,5.3-20.2c1.7-6.9,3-13,4-18.2c0.6-1.4,2.3-2.8,5-4.1c2.7-1.3,5.2-1.9,7.4-1.9c2.2,0,4,0.6,5.4,1.9
		c1.4,1.3,2,3,2,5.3c0,1.8-0.4,4.5-1.2,8.3c-0.8,3.8-1.8,7.9-3.1,12.4c3.4-4.6,7-9.3,10.8-14c3.8-4.7,7.9-9,12.1-12.8
		c4.2-3.8,8.5-6.9,12.7-9.2c4.2-2.3,8.4-3.5,12.6-3.5c5.6,0,9.4,2,11.4,6c2,4,3,8.5,3,13.4c0,2.7-0.3,5.5-0.8,8.3
		c-0.6,2.8-1.2,5.5-1.9,8.2c-0.7,2.6-1.6,5.2-2.5,7.8c3.2-5.1,6.7-9.9,10.4-14.3c3.8-4.4,7.8-7.9,12.1-10.6c4.3-2.6,9-4,13.9-4
		c5.9,0,10,1.8,12.2,5.3c2.2,3.5,3.4,7.4,3.4,11.8c0,4.2-0.7,8.6-2,13.3c-1.4,4.7-2.8,9.2-4.2,13.4c-1.4,4.2-2.2,7.9-2.2,10.9
		c0,1.8,0.4,3.4,1.3,4.8c0.9,1.4,2.6,2.2,5.2,2.2c4.3,0,8.5-2,12.5-6c4-4,7.7-8.9,11-14.8c3.4-5.8,6.2-11.4,8.6-16.7l3.8,4.3
		c-2.6,6.7-5.9,13.4-10,20.2c-4.1,6.7-8.8,12.3-14.3,16.8C631.5,187,625.4,189.2,618.7,189.2z"
            />
            <path
              fill="#EFCE9E"
              d="M674.2,192.4c-10.1,0-17.8-2.7-23-8.2s-7.9-12.2-7.9-20.4c0-7.2,1.8-14.8,5.4-22.7
		c3.6-7.9,8.4-15.4,14.5-22.3c6.1-7,12.8-12.6,20-17c7.3-4.4,14.5-6.6,21.7-6.6c4,0,7.8,1,11.4,3.1c3.6,2.1,5.4,6.2,5.4,12.5
		c0,6.1-1.8,11.8-5.4,17.2c-3.6,5.4-8.3,10.1-14.2,14.3c-5.8,4.2-12.3,7.6-19.4,10.2c-7.1,2.6-14.2,4.3-21.2,4.9
		c-0.2,1-0.3,1.9-0.5,2.9c-0.2,1-0.2,2.2-0.2,3.8c0,1.3,0.2,3,0.6,5.2c0.4,2.2,1.2,4.3,2.4,6.5c1.2,2.2,3.1,4,5.6,5.4
		c2.6,1.4,5.9,2.2,10.1,2.2c6.7,0,13.5-1.9,20.3-5.8c6.8-3.8,13.2-8.9,19.1-15.2c5.9-6.3,10.9-13.3,14.9-21l4.1,3.4
		c-4.3,9.6-9.8,18-16.6,25.1c-6.7,7.1-14.1,12.7-22.2,16.7C690.9,190.4,682.6,192.4,674.2,192.4z M663.6,149.9
		c4.2-0.8,8.9-2.4,14.2-4.9c5.3-2.5,10.3-5.6,15.1-9.4c4.8-3.8,8.8-7.9,11.9-12.4c3.1-4.5,4.7-9,4.7-13.7c0-1.8-0.3-3-1-3.8
		c-0.6-0.8-1.8-1.2-3.4-1.2c-3.8,0-7.8,1.4-11.9,4.2c-4.1,2.8-8.1,6.4-12,10.8c-3.9,4.4-7.4,9.3-10.4,14.6
		C667.8,139.5,665.4,144.8,663.6,149.9z"
            />

            <path
              fill="none"
              stroke="#7F4008"
              strokeWidth="4"
              strokeMiterlimit="10"
              d="M54.7,195.7c-1.6,0-3.6-0.2-6.1-0.7
		c-2.5-0.5-5-1.4-7.6-2.8c-2.6-1.4-4.6-3.4-6.2-6.2c-1.6-2.8-2.4-6.4-2.4-10.9c0-4.5,1-10.4,2.9-17.9c1.9-7.4,4.8-17.2,8.6-29.2
		c2.7-9.1,5.4-18.3,8.2-27.6c2.7-9.3,5-18.8,6.8-28.4c1.8-9.7,2.8-19.6,2.8-29.9c0-6.4-0.4-12-1.1-16.7c-0.7-4.7-2.1-8.4-4.2-10.9
		c-2.1-2.6-5.2-3.8-9.4-3.8c-4,0-7.5,1.1-10.4,3.4c-3,2.2-5.4,5.2-7.4,8.9c-2,3.7-3.4,7.7-4.3,12c-0.9,4.3-1.3,8.6-1.3,12.7
		c0,6.4,1,11.8,3.1,16.1c-7.4,0-12.6-1.8-15.8-5.4C7.6,54.7,6,50.2,6,45c0-4.8,1.2-9.7,3.6-14.8s5.7-9.7,9.8-13.9
		C23.6,12,28.4,8.6,34,6c5.5-2.6,11.4-4,17.6-4c10.6,0,18.5,4,23.9,11.9c5.4,7.9,8,18.9,8,33C83.5,58.2,82,70,79,82.3
		c-3,12.2-6.7,25.2-11,38.8c-1.9,6.1-4,12.4-6.2,18.8c-2.2,6.5-4.2,12.9-5.8,19.3c-1.6,6.4-2.4,12.5-2.4,18.2c0,3,0.4,5.2,1.2,6.6
		c0.8,1.4,2.4,2,4.8,2c4.2,0,8.7-1.9,13.6-5.6c4.9-3.8,9.8-8.8,14.9-15c5-6.2,9.8-13.2,14.4-21c4.6-7.8,8.8-15.7,12.7-23.8
		c3.9-8.1,7.2-15.8,9.7-23c2.6-7.3,4.2-13.6,5-19.1c5.8,0,10.1,1.6,13.1,4.7c3,3.1,4.4,6.1,4.4,9c0,1.9-0.8,5-2.4,9.4
		c-1.6,4.3-3.9,10.1-7,17.3c-2.6,5.9-5.2,12.2-7.8,19c-2.6,6.7-4.8,13.4-6.6,20c-1.8,6.6-2.6,12.8-2.6,18.6c0,3.2,0.4,5.6,1.2,7.2
		c0.8,1.6,2.5,2.4,5,2.4c4.5,0,9.7-2.2,15.6-6.7c5.9-4.5,12-10.6,18.2-18.2c6.2-7.7,12.3-16.4,18.2-26c5.9-9.7,11.3-19.7,16.1-30.1
		c4.8-10.4,8.6-20.6,11.5-30.7c2.9-10.1,4.3-19.4,4.3-27.8c0-8.5-1.4-14.6-4.3-18.2c-2.9-3.7-6.6-6.2-11-7.7
		c2.7-4.5,5.6-7.7,8.5-9.7c3-2,5.6-3,8-3c3.7,0,7.4,2.3,11,6.8c3.7,4.6,5.5,11.7,5.5,21.5c0,8.6-1.6,18.5-4.9,29.6
		c-3.3,11.1-7.8,22.6-13.4,34.6c-5.7,11.9-12.2,23.6-19.4,34.9c-7.3,11.4-15,21.6-23,30.7c-8.1,9.1-16.2,16.4-24.2,21.7
		c-8.1,5.4-15.7,8-22.9,8c-3.8,0-7.4-0.8-10.7-2.3c-3.3-1.5-5.9-3.8-7.8-6.7c-1.9-3-2.9-6.5-2.9-10.7c0-2.1,0.3-4.4,1-7.1
		c0.6-2.6,1.4-5.4,2.2-8.3c-7.8,10.4-15.8,18.8-24,25.3C70.6,192.4,62.6,195.7,54.7,195.7z"
            />
            <path
              fill="none"
              stroke="#7F4008"
              strokeWidth="4"
              strokeMiterlimit="10"
              d="M239.8,185.4c-10.1,0-17.8-2.7-23-8.2
		c-5.3-5.4-7.9-12.2-7.9-20.4c0-7.2,1.8-14.8,5.4-22.7c3.6-7.9,8.4-15.4,14.5-22.3c6.1-7,12.8-12.6,20-17c7.3-4.4,14.5-6.6,21.7-6.6
		c4,0,7.8,1,11.4,3.1c3.6,2.1,5.4,6.2,5.4,12.5c0,6.1-1.8,11.8-5.4,17.2c-3.6,5.4-8.3,10.1-14.2,14.3c-5.8,4.2-12.3,7.6-19.4,10.2
		c-7.1,2.6-14.2,4.3-21.2,4.9c-0.2,1-0.3,1.9-0.5,2.9c-0.2,1-0.2,2.2-0.2,3.8c0,1.3,0.2,3,0.6,5.2c0.4,2.2,1.2,4.3,2.4,6.5
		c1.2,2.2,3.1,4,5.6,5.4c2.6,1.4,5.9,2.2,10.1,2.2c6.7,0,13.5-1.9,20.3-5.8c6.8-3.8,13.2-8.9,19.1-15.2c5.9-6.3,10.9-13.3,14.9-21
		l4.1,3.4c-4.3,9.6-9.8,18-16.6,25.1c-6.7,7.1-14.1,12.7-22.2,16.7C256.5,183.4,248.2,185.4,239.8,185.4z M229.2,142.9
		c4.2-0.8,8.9-2.4,14.2-4.9c5.3-2.5,10.3-5.6,15.1-9.4c4.8-3.8,8.8-7.9,11.9-12.4c3.1-4.5,4.7-9,4.7-13.7c0-1.8-0.3-3-1-3.8
		c-0.6-0.8-1.8-1.2-3.4-1.2c-3.8,0-7.8,1.4-11.9,4.2c-4.1,2.8-8.1,6.4-12,10.8c-3.9,4.4-7.4,9.3-10.4,14.6
		C233.4,132.5,231,137.8,229.2,142.9z"
            />
            <path
              fill="none"
              stroke="#7F4008"
              strokeWidth="4"
              strokeMiterlimit="10"
              d="M309.4,182c-7.4,0-12.5-2.5-15.5-7.4
		c-3-5-4.4-10.9-4.4-17.8c0-7.8,1.4-17,4.3-27.6c2.9-10.6,6.7-21.6,11.4-33.2c4.7-11.6,9.9-23,15.6-34.1c5.7-11.1,11.4-21.2,17-30.2
		c5.7-9,11-16.2,15.8-21.6c4.9-5.4,8.8-8,11.6-8c1.9,0,3.6,1,4.9,3.1c1.4,2.1,2.4,4.6,3.2,7.6c0.8,3,1.2,5.6,1.2,8
		c0,4.3-1.1,10-3.2,16.9s-5.2,14.6-9.1,23c-3.9,8.4-8.6,17-13.9,25.7c-5.4,8.7-11.2,17-17.6,25c-6.4,7.9-13.3,14.8-20.6,20.5
		c-0.6,4-1.2,8-1.8,12c-0.6,4-0.8,7.7-0.8,11c0,5.9,0.9,10.3,2.8,13.1c1.8,2.8,4.4,4.2,7.6,4.2c4.2,0,8.4-1.9,12.6-5.8
		c4.2-3.8,8.3-8.7,12.1-14.5c3.8-5.8,7.2-11.9,10.1-18.1l5,2.9c-6.7,13.9-14.2,25-22.3,33.1S318.5,182,309.4,182z M313.7,119.1
		c5.6-5.8,10.9-12.2,15.8-19.3c5-7.1,9.6-14.4,13.8-21.7c4.2-7.4,8-14.5,11.2-21.5c3.2-7,5.7-13.2,7.4-18.7
		c1.8-5.5,2.7-9.9,2.9-13.1c0-0.6-0.2-1.2-0.5-1.7c-1.3,0-3.4,1.9-6.4,5.6c-3,3.8-6.4,8.8-10.3,15.2c-3.9,6.4-8,13.8-12.1,22.1
		c-4.2,8.3-8.2,17-12,26.2C319.7,101.4,316.4,110.3,313.7,119.1z"
            />
            <path
              fill="none"
              stroke="#7F4008"
              strokeWidth="4"
              strokeMiterlimit="10"
              d="M368.9,188.2c-8.2,0-14.9-2.6-20.2-7.8
		c-5.3-5.2-7.9-13.1-7.9-23.6c0-7.8,1.6-15.5,4.7-23c3.1-7.5,7.2-14.3,12.4-20.4c5.1-6.1,10.8-10.9,17-14.4c6.2-3.5,12.6-5.3,19-5.3
		c6.7,0,11.5,1.8,14.3,5.3c2.8,3.5,4.2,7.4,4.2,11.8c0,4.6-1.1,9-3.2,13c-2.2,4-5.1,6-8.8,6c-3,0-5.5-1.4-7.4-4.3
		c1.9-1.1,3.8-3.4,5.5-6.7c1.8-3.4,2.6-7.2,2.6-11.5c0-1.6-0.3-2.8-1-3.6c-0.6-0.8-1.9-1.2-3.8-1.2c-4.2,0-8.4,1.8-12.8,5.5
		c-4.4,3.7-8.5,8.4-12.4,14.3c-3.8,5.8-7,12-9.4,18.4c-2.4,6.4-3.6,12.4-3.6,18c0,4.6,1.2,8.9,3.6,12.7c2.4,3.8,7,5.8,13.7,5.8
		c6.2,0,12.6-1.8,19.1-5.3c6.5-3.5,12.6-8.5,18.4-14.9c5.8-6.4,10.3-14,13.7-22.8l4.3,3.8c-3.8,9.6-9.1,18.2-15.7,25.8
		c-6.6,7.6-14,13.6-22.1,18C384.9,186,376.9,188.2,368.9,188.2z"
            />
            <path
              fill="none"
              stroke="#7F4008"
              strokeWidth="4"
              strokeMiterlimit="10"
              d="M432.7,182.5c-7,0-11.9-2.3-14.6-6.8
		s-4.1-9.7-4.1-15.5c0-5.1,0.8-10.3,2.4-15.6c1.6-5.3,3.8-10.2,6.5-14.9c2.7-4.6,5.8-8.4,9.1-11.3c3.4-2.9,6.8-4.3,10.3-4.3
		c1,0,2.1,0.2,3.5,0.6c1.4,0.4,2.4,0.9,3,1.6c-1.8,1.9-3.6,4.6-5.6,8.2c-2,3.5-3.8,7.3-5.5,11.4s-3,8.2-4.1,12.2
		c-1,4.1-1.6,7.8-1.6,11.2c0,3.7,0.6,6.6,1.9,8.6c1.3,2.1,3.4,3.1,6.2,3.1c3.2,0,7-1.7,11.4-5.2c4.4-3.4,8.6-7.6,12.6-12.6
		c-5-4.3-8.6-9.3-10.9-15c-2.3-5.7-3.5-12.1-3.5-19.3c0-4,0.9-8.2,2.6-12.7c1.8-4.5,4.5-8.2,8.2-11.3c3.7-3,8.5-4.6,14.4-4.6
		c6.7,0,11.4,1.9,14,5.6c2.6,3.8,4,8.3,4,13.6c0,5.9-1.6,12.6-4.7,20c-3.1,7.4-6.8,14.5-11.2,21.2c2.2,1.3,4.7,1.9,7.4,1.9
		c2.4,0,5.3-0.6,8.6-1.7c3.4-1.1,6.6-3,9.7-5.6c3.1-2.6,5.6-6.1,7.6-10.4l3.8,2.9c-3.4,7.8-8,13.6-13.8,17.2
		c-5.8,3.6-11.5,5.4-16.9,5.4c-2.1,0-4.2-0.2-6.2-0.6c-2.1-0.4-4-1-5.8-1.8c-5.4,6.7-11.6,12.5-18.4,17.3
		C446.4,180.1,439.6,182.5,432.7,182.5z M469.7,146c4-5.6,7.3-11.6,10-18.1s4-12.4,4-17.9c0-4-0.6-6.9-1.8-8.8
		c-1.2-1.8-2.8-2.8-4.9-2.8c-3.2,0-6.4,2.2-9.6,6.6c-3.2,4.4-4.8,10-4.8,16.7c0,3.8,0.6,8.1,1.8,12.8
		C465.5,139.3,467.3,143.1,469.7,146z"
            />
            <path
              fill="none"
              stroke="#7F4008"
              strokeWidth="4"
              strokeMiterlimit="10"
              d="M624.7,182.2c-6.1,0-10.6-1.8-13.4-5.4
		S607,169,607,164c0-3.8,0.6-7.6,1.7-11.4c1.1-3.8,2.3-7.5,3.5-11.2c1.2-3.7,1.8-7,1.8-10.1c0-2.9-0.6-4.9-1.8-6
		c-1.2-1.1-2.6-1.7-4.2-1.7c-3.8,0-8.2,2.9-13,8.8c-4.8,5.8-10.9,14.2-18.2,25.1c-2.6,3.8-4.9,7.8-7,12c-2.1,4.2-4,7.8-5.8,10.8
		c-1.3,0-3-0.2-5.3-0.7c-2.2-0.5-4.2-1.1-5.9-1.9c-1.7-0.8-2.5-1.8-2.5-3.1c0-1.4,0.8-4.2,2.4-8.4c1.6-4.2,3.4-9,5.5-14.6
		c2.1-5.6,3.9-11.2,5.4-16.7c1.5-5.5,2.3-10.2,2.3-14c0-2.4-0.4-4.3-1.2-5.6c-0.8-1.4-2.2-2-4.1-2c-3.4,0-7.4,2-12.2,6.1
		s-9.8,9.4-15.1,16c-5.3,6.6-10.2,13.9-14.8,22c-4.6,8.1-8.3,16.1-11.2,24.1c-1.8,0-3.8-0.3-6.2-1c-2.4-0.6-4.5-1.4-6.2-2.4
		c-1.8-1-2.6-1.8-2.6-2.6c0-0.5,0.6-3,1.9-7.4c1.3-4.5,2.8-10,4.7-16.6c1.8-6.6,3.6-13.3,5.3-20.2c1.7-6.9,3-13,4-18.2
		c0.6-1.4,2.3-2.8,5-4.1c2.7-1.3,5.2-1.9,7.4-1.9c2.2,0,4,0.6,5.4,1.9c1.4,1.3,2,3,2,5.3c0,1.8-0.4,4.5-1.2,8.3
		c-0.8,3.8-1.8,7.9-3.1,12.4c3.4-4.6,7-9.3,10.8-14c3.8-4.7,7.9-9,12.1-12.8c4.2-3.8,8.5-6.9,12.7-9.2c4.2-2.3,8.4-3.5,12.6-3.5
		c5.6,0,9.4,2,11.4,6c2,4,3,8.5,3,13.4c0,2.7-0.3,5.5-0.8,8.3c-0.6,2.8-1.2,5.5-1.9,8.2c-0.7,2.6-1.6,5.2-2.5,7.8
		c3.2-5.1,6.7-9.9,10.4-14.3c3.8-4.4,7.8-7.9,12.1-10.6c4.3-2.6,9-4,13.9-4c5.9,0,10,1.8,12.2,5.3c2.2,3.5,3.4,7.4,3.4,11.8
		c0,4.2-0.7,8.6-2,13.3c-1.4,4.7-2.8,9.2-4.2,13.4c-1.4,4.2-2.2,7.9-2.2,10.9c0,1.8,0.4,3.4,1.3,4.8c0.9,1.4,2.6,2.2,5.2,2.2
		c4.3,0,8.5-2,12.5-6c4-4,7.7-8.9,11-14.8c3.4-5.8,6.2-11.4,8.6-16.7l3.8,4.3c-2.6,6.7-5.9,13.4-10,20.2
		c-4.1,6.7-8.8,12.3-14.3,16.8C637.5,180,631.4,182.2,624.7,182.2z"
            />
            <path
              fill="none"
              stroke="#7F4008"
              strokeWidth="4"
              strokeMiterlimit="10"
              d="M680.2,185.4c-10.1,0-17.8-2.7-23-8.2
		s-7.9-12.2-7.9-20.4c0-7.2,1.8-14.8,5.4-22.7c3.6-7.9,8.4-15.4,14.5-22.3c6.1-7,12.8-12.6,20-17c7.3-4.4,14.5-6.6,21.7-6.6
		c4,0,7.8,1,11.4,3.1c3.6,2.1,5.4,6.2,5.4,12.5c0,6.1-1.8,11.8-5.4,17.2c-3.6,5.4-8.3,10.1-14.2,14.3c-5.8,4.2-12.3,7.6-19.4,10.2
		c-7.1,2.6-14.2,4.3-21.2,4.9c-0.2,1-0.3,1.9-0.5,2.9c-0.2,1-0.2,2.2-0.2,3.8c0,1.3,0.2,3,0.6,5.2c0.4,2.2,1.2,4.3,2.4,6.5
		c1.2,2.2,3.1,4,5.6,5.4c2.6,1.4,5.9,2.2,10.1,2.2c6.7,0,13.5-1.9,20.3-5.8c6.8-3.8,13.2-8.9,19.1-15.2c5.9-6.3,10.9-13.3,14.9-21
		l4.1,3.4c-4.3,9.6-9.8,18-16.6,25.1c-6.7,7.1-14.1,12.7-22.2,16.7C696.9,183.4,688.6,185.4,680.2,185.4z M669.6,142.9
		c4.2-0.8,8.9-2.4,14.2-4.9c5.3-2.5,10.3-5.6,15.1-9.4c4.8-3.8,8.8-7.9,11.9-12.4c3.1-4.5,4.7-9,4.7-13.7c0-1.8-0.3-3-1-3.8
		c-0.6-0.8-1.8-1.2-3.4-1.2c-3.8,0-7.8,1.4-11.9,4.2c-4.1,2.8-8.1,6.4-12,10.8c-3.9,4.4-7.4,9.3-10.4,14.6
		C673.8,132.5,671.4,137.8,669.6,142.9z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
