import React, { FC } from "react";
import { Navigate } from "react-router-dom";
import { User } from "../types/types";

interface IProtected {
  children: React.ReactElement;
  isSignedIn: User | null;
}

const Protected: FC<IProtected> = ({ children, isSignedIn }) => {
  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default Protected;
