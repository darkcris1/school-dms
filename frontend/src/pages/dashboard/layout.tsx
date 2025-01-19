import React from 'react'
import { Outlet } from 'react-router-dom'

export default function DashboardLayout() {
  return (
    <>
        <header>
            <nav>
                <ul>
                    <li>Home</li>
                    <li>Profile</li>
                    <li>Logout</li>
                </ul>
            </nav>
        </header>

        <Outlet />
    </>
  )
}
