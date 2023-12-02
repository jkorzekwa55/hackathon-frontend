import React, { Suspense } from 'react';
import { createBrowserRouter, RouteObject, RouterProvider } from "react-router-dom";
import SignInEmail from "./modules/sign-in/pages/SignInEmail";
import SignInEmailCode from "./modules/sign-in/pages/SignInEmailCode";
import SignInFillData from "./modules/sign-in/pages/SignInFillData";
import Home from "./modules/home/pages/Home";

function App() {

    const routes: RouteObject[] = [
        {
            path: "/",
            element: <Home />,
            errorElement: <div>something unexpected happened</div>,
        },
        {
            path: "/sign-in",
            element: <SignInEmail />,
            errorElement: <div>something unexpected happened</div>,
        },
        {
            path: "/sign-in/email",
            element: <SignInEmailCode />,
            errorElement: <div>something unexpected happened</div>,

        },
        {
            path: "/sign-in/code",
            element: <SignInFillData />,
            errorElement: <div>something unexpected happened</div>,
        }
    ];

    const router = createBrowserRouter(routes);

  return (
    <Suspense fallback={<div>future loader</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
