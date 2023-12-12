/*!
=========================================================
* Muse Ant Design Dashboard - v1.0.0
=========================================================
* Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
* Coded by Creative Tim
=========================================================
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import { Route, Redirect } from "react-router-dom";
import Home from "./pages/Home";
import Tables from "./pages/Tables";
import Billing from "./pages/Billing";
import SignIn from "./pages/SignIn";
import Main from "./components/layout/Main";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import ProductProvider from "./store/product-context";
import { AuthContext } from "./store/AuthProvider";
import React, { useContext } from "react";
import Edit from "./pages/Edit";

function App() {
  const currentUser = useContext(AuthContext).user;

  const RequireAuth = ({ children }) => {
    return currentUser ? (
      children
    ) : (
      <>
        <SignIn />
        <Redirect from="*" to="/signin" />;
      </>
    );
  };

  return (
    <RequireAuth>
      <ProductProvider>
        <Main>
          <Route exact path="/dashboard" component={Home} />
          <Route exact path="/tables" component={Tables} />
          <Route exact path="/billing" component={Billing} />
          <Route exact path="/edit/:id" component={Edit} />
          <Redirect from="*" to="/tables" />
        </Main>
      </ProductProvider>
    </RequireAuth>
  );
}

export default App;
