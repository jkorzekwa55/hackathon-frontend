import React, {Suspense, useState} from 'react';
import {createBrowserRouter, createHashRouter, RouteObject, RouterProvider} from "react-router-dom";
import SignInEmail from "./modules/sign-in/pages/SignInEmail";
import SignInEmailCode from "./modules/sign-in/pages/SignInEmailCode";
import SignInFillData from "./modules/sign-in/pages/SignInFillData";
import Home from "./modules/home/pages/Home";
import Events from "./modules/home/components/EventsModalComponent";
import {AuthenticationContext} from "./AuthenticationContext";


function App() {

    const [authenticated, setAuthenticated] = useState(true);

    const routes: RouteObject[] = [
        {
            path: "/",
            element: <Home setAuthenticated={setAuthenticated}/>,
            errorElement: <div>something unexpected happened</div>,
        },
        {
            path: "/sign-in",
            element: <SignInEmail />,
            errorElement: <div>something unexpected happened</div>,
        },
        {
            path: "/sign-in/code",
            element: <SignInEmailCode />,
            errorElement: <div>something unexpected happened</div>,

        },
        {
            path: "/sign-in/data",
            element: <SignInFillData setAuthenticated={setAuthenticated}/>,
            errorElement: <div>something unexpected happened</div>,
        }
    ];

    const router = createHashRouter(routes);

  return (
    <Suspense fallback={<div>future loader</div>}>
        <AuthenticationContext.Provider value={{authenticated: authenticated}}>
            <RouterProvider router={router} />
        </AuthenticationContext.Provider>
    </Suspense>
  );
}

export default App;
