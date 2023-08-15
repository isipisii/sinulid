import React, { FC } from "react";
import { Navigate } from "react-router-dom";

interface IProtected {
  children: React.ReactElement | React.ReactElement[];
  isSignedIn: string | null;
}

const Protected: FC<IProtected> = ({ children, isSignedIn }) => {
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default Protected;
