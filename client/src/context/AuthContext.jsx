import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  // user: {
  //   _id: "61e46b114e6c0507599c77e9",
  //   username: "spyder",
  //   email: "spyder@gmail.com",
  //   profilePicture: "/person/4.jpeg",
  //   coverPicture: "",
  //   isAdmin: false,
  //   followers: [],
  //   followings: [],
  // },
  isFetching: false,
  error: false,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
