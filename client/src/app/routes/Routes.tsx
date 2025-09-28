import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../layout/App";
import Catalog from "../../features/catalog/Catalog";
import ProductDetails from "../../features/catalog/ProductDetails";
import AboutPage from "../../features/about/AboutPage";
import ContactPage from "../../features/contact/ContactPage";
import PrivacyPolicyPage from "../../features/privacy/PrivacyPolicyPage";
import FAQPage from "../../features/faq/FAQPage";
import LoginForm from "../../features/account/LoginForm.tsx";
import RegisterForm from "../../features/account/RegisterForm.tsx";
import ProfilePage from "../../features/account/ProfilePage.tsx";
import RequireAuth from "./RequireAuth.tsx";
import InventoryPage from "../../features/admin/inventoryPage.tsx";
import SavedProductsPage from "../../features/catalog/SavedProductsPage.tsx";
import Messenger from "../../features/messages/Messenger.tsx";

export const router = createBrowserRouter([
    {
        path: "/", /*home*/
        element: <App/>,
        children: [
            {element: <RequireAuth/>, children: [
                {path: 'profile', element: <ProfilePage/>},
                {path: 'saved-products', element: <SavedProductsPage/>},
                {path: 'messages', element: <Messenger/>}
            ]},
            {path: 'inventory', element: <InventoryPage/>},
            {path: '', element: <Catalog />},
            {path: ':id', element: <ProductDetails />},
            {path: 'about', element: <AboutPage />},
            {path: 'contact', element: <ContactPage />},
            {path: 'privacy', element: <PrivacyPolicyPage />},
            {path: 'faq', element: <FAQPage />},
            {path: 'login', element: <LoginForm />},
            {path: 'register', element: <RegisterForm />},
            {path: '*', element: <Navigate replace to='/not-found'/>}
        ]
    }
])