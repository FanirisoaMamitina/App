import React, { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useStateContext } from '../contexts/ContextProvider'
import axiosClient from '../axios-client'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

function DefaultLayout() {
    const { user, token, setUser } = useStateContext()

    if (!token) {
        return <Navigate to="/login" />
    }

    useEffect(() => {
        axiosClient.get('/user')
            .then(({ data }) => {
                setUser(data)
            })
    }, [])

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex flex-col flex-grow w-full">
                <Navbar />
                <main className="flex-grow scrollbar-track-dark-second scrollbar-thumb-gray-line scrollbar-thin overflow-y-auto bg-dark-primary container-fluid">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default DefaultLayout
