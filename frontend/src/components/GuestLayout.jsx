import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useStateContext } from '../contexts/ContextProvider'
import logo from '../assets/image/logo.png'

function GuestLayout() {
    const { user, token } = useStateContext()

    if (token) {
        return <Navigate to="/" />
    }
    return (
        <div>
            <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    <div>
                        <img className="mx-auto h-20 w-auto" src={logo} />
                    </div>

                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default GuestLayout
