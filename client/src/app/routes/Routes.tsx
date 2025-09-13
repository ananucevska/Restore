import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import Catalog from "../../features/catalog/Catalog";
import ProductDetails from "../../features/catalog/ProductDetails";
import AboutPage from "../../features/about/AboutPage";
import ContactPage from "../../features/contact/ContactPage";
import LoginForm from "../../features/account/LoginForm.tsx";
import RegisterForm from "../../features/account/RegisterForm.tsx";
import RequireAuth from "./RequireAuth.tsx";
import OrdersPage from "../../features/orders/OrdersPage.tsx";
import OrderDetailedPage from "../../features/orders/OrderDetailedPage.tsx";
import InventoryPage from "../../features/admin/inventoryPage.tsx";

export const router = createBrowserRouter([
    {
        path: "/", /*home*/
        element: <App/>,
        children: [
            {element: <RequireAuth/>, children: [
                {path: 'orders', element: <OrdersPage/>},
                {path: 'orders/:id', element: <OrderDetailedPage/>},
                {path: 'inventory', element: <InventoryPage/>}
            ]},
            {path: '', element: <HomePage />},
            {path: 'catalog', element: <Catalog />},
            {path: 'catalog/:id', element: <ProductDetails />},
            {path: 'about', element: <AboutPage />},
            {path: 'contact', element: <ContactPage />},
            {path: 'login', element: <LoginForm />},
            {path: 'register', element: <RegisterForm />},
            {path: '*', element: <Navigate replace to='/not-found'/>}
        ]
    }
])