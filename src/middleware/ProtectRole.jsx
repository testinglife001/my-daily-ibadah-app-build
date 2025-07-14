import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectRole = ({role}) => {
  
    // const user = "";
    const userInfo = {
        username : 'audwit',
        role : 'admin'
    }

    if(userInfo.role === role) {
        return <Outlet />
    }else {
        return <Navigate to='/dashboard/unauthorized' />
    }

}

export default ProtectRole