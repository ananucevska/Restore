﻿import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import Catalog from "../../features/catalog/Catalog";
import ProductDetails from "../../features/catalog/ProductDetails";
import AboutPage from "../../features/about/AboutPage";
import ContactPage from "../../features/contact/ContactPage";
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import BasketPage from "../../features/basket/BasketPage";
import CheckoutPage from "../../features/checkout/CheckoutPage";
import LoginForm from "../../features/account/LoginForm.tsx";
import RegisterForm from "../../features/account/RegisterForm.tsx";
import RequireAuth from "./RequireAuth.tsx";
import CheckoutSuccess from "../../features/checkout/CheckoutSuccess.tsx";
import OrdersPage from "../../features/orders/OrdersPage.tsx";
import OrderDetailedPage from "../../features/orders/OrderDetailedPage.tsx";

export const router = createBrowserRouter([
    {
        path: "/", /*home*/
        element: <App/>,
        children: [
            {element: <RequireAuth/>, children: [
                {path: 'checkout', element: <CheckoutPage/>}, 
                {path: 'checkout/success', element: <CheckoutSuccess/>},
                {path: 'orders', element: <OrdersPage/>},
                {path: 'orders/:id', element: <OrderDetailedPage/>}
                ]},
            {path: '', element: <HomePage />},
            {path: 'catalog', element: <Catalog />},
            {path: 'catalog/:id', element: <ProductDetails />},
            {path: 'about', element: <AboutPage />},
            {path: 'contact', element: <ContactPage />},
            {path: 'basket', element: <BasketPage />},
            {path: 'checkout', element: <CheckoutPage />},
            {path: 'server-error', element: <ServerError />},
            {path: 'login', element: <LoginForm />},
            {path: 'register', element: <RegisterForm />},
            {path: 'not-found', element: <NotFound/>},
            {path: '*', element: <Navigate replace to='/not-found'/>}
        ]
    }
])