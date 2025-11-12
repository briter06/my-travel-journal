import { Navigate } from 'react-router';
import { getFromStorage } from '../../../utils/storage';
import React from 'react';

export const authHomeRedirector = (
  node: React.JSX.Element,
): React.JSX.Element =>
  getFromStorage('token') == null ? node : <Navigate to="/" replace />;
