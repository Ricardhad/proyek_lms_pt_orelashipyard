import React from "react";
import { Navigate } from "react-router-dom";
import * as jwtdecode from 'jwt-decode';// Default import

const ProtectedRoute = ({ element: Element, requiredRole, ...rest }) => {
  const token = localStorage.getItem("token");

  // Check if the token exists
  if (!token) {
    return <Navigate to="/" />;
  }

  // Decode the token to check role
  let roleType;
  try {
    const decode =jwtdecode.jwtDecode
    const decodedToken = decode(token);
    roleType = decodedToken.roleType; // Adjust this according to your token structure
  } catch (error) {
    console.error("Failed to decode token:", error);
    return <Navigate to="/" />;
  }

  console.log("User role type:", roleType); // Log the role type for debugging

  // Check if the role matches the required role
  if (roleType === requiredRole) {
    return <Element {...rest} />;
  }

  // Redirect if the role does not match
  return <Navigate to="/" />;
};

export default ProtectedRoute;