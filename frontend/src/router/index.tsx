import { createBrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import CvEditorPage from '../pages/CvEditorPage';
import CvPreviewPage from '../pages/CvPreviewPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProtectedRoute from './ProtectedRoute';
import AppLayout from '../components/layout/AppLayout';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <DashboardPage /> },
          { path: '/cv/:id', element: <CvEditorPage /> },
        ]
      },
      // Preview strona musi być poza głównym Layoutem (bez headera/stopki)
      { path: '/cv/:id/preview', element: <CvPreviewPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
