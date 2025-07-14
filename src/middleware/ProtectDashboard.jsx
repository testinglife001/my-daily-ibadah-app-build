import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectDashboard = () => {

    // const user = "";
    const user = {
        username : 'audwit',
        role : 'admin'
    }

    if(user) {
        return <Outlet />
    }else {
        return <Navigate to='/sign-in' />
    }
  
}

export default ProtectDashboard