import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../layout/App";
import Catalog from "../../features/catalog/Catalog";
import ProductDetails from "../../features/catalog/ProductDetails";
import AboutPage from "../../features/about/AboutPage";
import ContactPage from "../../features/contact/ContactPage";
import LoginForm from "../../features/account/LoginForm.tsx";
import RegisterForm from "../../features/account/RegisterForm.tsx";
import ProfilePage from "../../features/account/ProfilePage.tsx";
import RequireAuth from "./RequireAuth.tsx";
import OrdersPage from "../../features/orders/OrdersPage.tsx";
import OrderDetailedPage from "../../features/orders/OrderDetailedPage.tsx";
import InventoryPage from "../../features/admin/inventoryPage.tsx";
import SavedProductsPage from "../../features/catalog/SavedProductsPage.tsx";

export const router = createBrowserRouter([
    {
        path: "/", /*home*/
        element: <App/>,
        children: [
            {element: <RequireAuth/>, children: [
                {path: 'profile', element: <ProfilePage/>},
                {path: 'orders', element: <OrdersPage/>},
                {path: 'orders/:id', element: <OrderDetailedPage/>},
                {path: 'saved-products', element: <SavedProductsPage/>}
            ]},
            {path: 'inventory', element: <InventoryPage/>},
            {path: '', element: <Catalog />},
            {path: ':id', element: <ProductDetails />},
            {path: 'about', element: <AboutPage />},
            {path: 'contact', element: <ContactPage />},
            {path: 'login', element: <LoginForm />},
            {path: 'register', element: <RegisterForm />},
            {path: '*', element: <Navigate replace to='/not-found'/>}
        ]
    }
])