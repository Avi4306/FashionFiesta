import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * ProtectedRoute Component for Role-Based Access Control
 *
 * This component acts as a wrapper for routes that require
 * specific user authentication AND authorization (roles).
 *
 * It uses the 'Outlet' component from react-router-dom to render
 * child routes if the user meets the access criteria.
 *
 * Props:
 * - allowedRoles (array of strings): An array of roles that are
 * permitted to access the nested routes. E.g., ['admin', 'moderator'].
 */
const ProtectedRoute = ({ allowedRoles }) => {
  // Get authentication data from Redux store
  // Assumes your Redux state for auth is stored under `state.auth.authData`
  const { authData } = useSelector((state) => state.auth);

  // Determine if the user is authenticated (has token and result data)
  const isAuthenticated = !!authData?.token && !!authData?.result?._id;

  // Get the user's role from the authenticated data
  const userRole = authData?.result?.role;

  // --- Authorization Logic ---
  // 1. Check if the user is authenticated.
  // 2. If authenticated, check if their role is included in the allowedRoles.
  const isAuthorized = isAuthenticated && allowedRoles.includes(userRole);

  // --- Redirection Logic ---
  if (!isAuthenticated) {
    // If not authenticated, redirect to the login page
    // The 'replace' prop ensures that the login page replaces the current entry in the history stack,
    // so the user can't just hit back to get to the protected page.
    return <Navigate to="/auth" replace />;
  }

  if (!isAuthorized) {
    // If authenticated but not authorized (wrong role), redirect to an unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }

  // If authenticated and authorized, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;