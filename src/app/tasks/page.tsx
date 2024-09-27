"use client";

import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import axios from "axios";
import { getCookie } from "@/components/functions/clientFunctions";
import KanbanView from "@/components/KanbanView";
import ListView from "@/components/ListView";
import TaskDetailDialog from "@/components/TaskDetailDialog";
import { Button } from "@/components/ui/button";
import { revaldatePathCache, signOut } from "@/components/functions/serverFunctions";

type Task = {
	_id: string;
	title: string;
	description?: string;
	status: "todo" | "inprogress" | "completed";
	priority: "low" | "medium" | "high";
	dueDate?: Date | null;
};

export default function TaskManagement() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [view, setView] = useState<"kanban" | "list">("list");
	const [sortBy, setSortBy] = useState<"priority" | "status" | "dueDate">(
		"priority"
	);
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [isAddingTask, setIsAddingTask] = useState(false);

	useEffect(() => {
		fetchTasks();
	}, []);

	const fetchTasks = async () => {
		try {
			const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
			const token = getCookie("token");
			if (token) {
				axios.defaults.headers.common[
					"Authorization"
				] = `Bearer ${token}`;
			} else {
				window.location.href = "/login";
			}

            const resp = await axios.get(baseUrl + "/api/");
            if (resp.status !== 200) {
                window.location.href = "/login";
            }

			const response = await axios.get(baseUrl + "/api/tasks");
			const fetchedTasks = response.data.tasks.map((task: Task) => ({
				...task,
				dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
			}));
			setTasks(fetchedTasks);
		} catch (error) {
			console.error("Error fetching tasks:", error);
		}
	};

	const sortedTasks = [...tasks].sort((a, b) => {
		if (sortBy === "priority") {
			const priorityOrder = { low: 0, medium: 1, high: 2 };
			return sortOrder === "asc"
				? priorityOrder[a.priority] - priorityOrder[b.priority]
				: priorityOrder[b.priority] - priorityOrder[a.priority];
		} else if (sortBy === "status") {
			const statusOrder = { todo: 0, inprogress: 1, completed: 2 };
			return sortOrder === "asc"
				? statusOrder[a.status] - statusOrder[b.status]
				: statusOrder[b.status] - statusOrder[a.status];
		} else {
			if (!a.dueDate) return sortOrder === "asc" ? 1 : -1;
			if (!b.dueDate) return sortOrder === "asc" ? -1 : 1;
			return sortOrder === "asc"
				? a.dueDate.getTime() - b.dueDate.getTime()
				: b.dueDate.getTime() - a.dueDate.getTime();
		}
	});

	const addTask = async (newTask: Omit<Task, "_id">) => {
		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
		const token = getCookie("token");
		if (token) {
			axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
		} else {
			window.location.href = "/login";
		}
        
        const response = await axios.get(baseUrl + "/api/");
        if (response.status !== 200) {
            window.location.href = "/login";
        }

		try {
			const response = await axios.post(baseUrl + "/api/tasks", newTask);
			await fetchTasks();
			setIsAddingTask(false);
		} catch (error) {
			console.error("Error adding task:", error);
		}

        revaldatePathCache("/tasks")
	};

	const updateTask = async (updatedTask: Task) => {
		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
		const token = getCookie("token");
		if (token) {
			axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
		} else {
			window.location.href = "/login";
		}

        const response = await axios.get(baseUrl + "/api/");
        if (response.status !== 200) {
            window.location.href = "/login";
        }

		try {
			const response = await axios.put(
				baseUrl + `/api/tasks/${updatedTask._id}`,
				updatedTask
			);
			await fetchTasks();
			setSelectedTask(null);
		} catch (error) {
			console.error("Error updating task:", error);
            throw error;
		}
	};

	const deleteTask = async (taskId: string) => {
		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
		const token = getCookie("token");
		if (token) {
			axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
		} else {
			window.location.href = "/login";
		}

        const response = await axios.get(baseUrl + "/api/");
        if (response.status !== 200) {
            window.location.href = "/login";
        }

		try {
			const response = await axios.delete(
				baseUrl + `/api/tasks/${taskId}`
			);
			await fetchTasks();
			if (selectedTask && selectedTask._id === taskId) {
				setSelectedTask(null);
			}
		} catch (error) {
			console.error("Error deleting task:", error);
		}
	};

    const handleLogout = async () => {
        await signOut()
        window.location.href = "/"
    }

	return (
		<div className="container mx-auto p-4">
			<div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Task Management</h1>
                <Button onClick={handleLogout} variant="outline">Logout</Button>
            </div>
			<div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
				<div>
					<Button
						onClick={() => setView("kanban")}
						variant={view === "kanban" ? "default" : "outline"}
						className="mr-2"
					>
						Kanban
					</Button>
					<Button
						onClick={() => setView("list")}
						variant={view === "list" ? "default" : "outline"}
					>
						List
					</Button>
				</div>
				{view == "list" && (
                    <div className="flex items-center">
					<Label htmlFor="sortBy" className="mr-2">
						Sort by:
					</Label>
					<Select
						name="sortBy"
						value={sortBy}
						onValueChange={(value) =>
							setSortBy(
								value as "priority" | "status" | "dueDate"
							)
						}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Sort By.." />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="priority">Priority</SelectItem>
							<SelectItem value="dueDate">Due Date</SelectItem>
							<SelectItem value="status">Status</SelectItem>
						</SelectContent>
					</Select>
					<Button
						onClick={() =>
							setSortOrder(sortOrder === "asc" ? "desc" : "asc")
						}
						className="ml-2"
					>
						{sortOrder === "asc" ? "↑" : "↓"}
					</Button>
				</div>)}
			</div>

			<Button onClick={() => setIsAddingTask(true)} className="mb-4">
				<Plus className="mr-2 h-4 w-4" /> Add Task
			</Button>

			{view === "kanban" ? (
				<KanbanView
                    onTaskClick={setSelectedTask}
					onDeleteTask={deleteTask}
				/>
			) : (
				<ListView
					tasks={sortedTasks}
					onTaskClick={setSelectedTask}
					onDeleteTask={deleteTask}
				/>
			)}

			{selectedTask && (
				<TaskDetailDialog
					task={selectedTask}
					onClose={() => setSelectedTask(null)}
					onUpdate={updateTask}
					onDelete={deleteTask}
				/>
			)}

			{isAddingTask && (
				<TaskDetailDialog
					task={{
						_id: "",
						title: "",
						status: "todo",
						priority: "medium",
					}}
					onClose={() => setIsAddingTask(false)}
					onUpdate={addTask}
					onDelete={() => {}}
					isNewTask
				/>
			)}
		</div>
	);
}