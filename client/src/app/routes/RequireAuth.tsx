﻿import {useUserInfoQuery} from "../../features/account/accountApi.ts";
import {Navigate, Outlet, useLocation} from "react-router-dom";

export default function RequireAuth() {
    const {data: user, isLoading} = useUserInfoQuery();
    const location = useLocation();
    
    if (isLoading) return <div>Loading...</div>
    
    if (!user) {
        return <Navigate to="/login" state={{from: location}} />
    }
    
    return (
        <Outlet />
    );
}