import React, { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Route-level code splitting – Profile and Viewstory are only loaded when visited
const Viewstory = lazy(() => import('./Viewstory.jsx'));
const Profile = lazy(() => import('./Profile.jsx'));

// Minimal loading fallback (no external deps)
const PageLoader = () => (
  <div className="fixed inset-0 bg-black flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-neutral-700 border-t-purple-500 rounded-full animate-spin" />
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/story/:id/:tot',
    element: <Suspense fallback={<PageLoader />}><Viewstory /></Suspense>,
  },
  {
    path: '/Story/:id/:tot',
    element: <Suspense fallback={<PageLoader />}><Viewstory /></Suspense>,
  },
  {
    path: '/profile',
    element: <Suspense fallback={<PageLoader />}><Profile /></Suspense>,
  },
  {
    path: '*',
    element: <App />,
  },
]);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
