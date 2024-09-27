"use client"

import { useState, useEffect } from "react"
import { getCookie } from "./functions/clientFunctions"
import { signOut } from "./functions/serverFunctions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, List, Columns, Calendar } from "lucide-react"

export default function HomePage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        const token = getCookie("token")
        setIsLoggedIn(!!token)
    }, [])

    const handleLogout = async () => {
        await signOut()
        setIsLoggedIn(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
            <header className="p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">TaskShare</h1>
                <nav>
                    {!isLoggedIn && (
                        <>
                            <Button 
                                variant="outline"
                                onClick={() => window.location.href = "/signup"}
                                className="mr-2"
                            >
                                Sign Up
                            </Button>
                            <Button 
                                variant="outline"
                                onClick={() => window.location.href = "/login"}
                            >
                                Login
                            </Button>
                        </>
                    )}
                    {isLoggedIn && (
                        <Button 
                            variant="outline"
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    )}
                </nav>
            </header>

            <main className="container mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Streamline Your Projects with Kanban-Powered Task Management</h2>
                    <p className="text-xl text-gray-600 mb-8">Effortlessly organize, prioritize, and collaborate on your tasks with our intuitive Kanban and List views.</p>
                    <Button 
                        size="lg"
                        onClick={async () => {
                            const token = getCookie("token")
                            if (!token) {
                                window.location.href = "/login"
                            } else {
                                window.location.href = "/tasks"
                            }
                        }}
                    >
                        Get Started
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Columns className="mr-2" />
                                Kanban View
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Visualize your workflow with customizable boards. Drag and drop tasks between To Do, In Progress, and Completed columns.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <List className="mr-2" />
                                List View
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Prefer a traditional approach? Our list view allows for quick task management and easy prioritization.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Calendar className="mr-2" />
                                Due Dates
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Never miss a deadline. Set and track due dates for all your tasks to stay on schedule.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <CheckCircle className="mr-2" />
                                Task Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Add descriptions, set priorities, and manage task statuses to keep your team informed and aligned.</p>
                        </CardContent>
                    </Card>
                </div>
            </main>

            <footer className="mt-16 p-4 text-center text-gray-600">
                <p>&copy; 2024 TaskShare. All rights reserved.</p>
            </footer>
        </div>
    )
}