"use client";

import React, { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { getCookie } from "@/components/functions/clientFunctions";
import axios from "axios";
import { revaldatePathCache } from "./functions/serverFunctions";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";

interface Task {
	_id: string;
	title: string;
	description: string;
	status: "todo" | "inprogress" | "completed";
	priority: "low" | "medium" | "high";
	dueDate: Date | null;
}

const TaskCard: React.FC<{
	task: Task;
	moveTask: (
		_id: string,
		status: "todo" | "inprogress" | "completed"
	) => void;
	tasks: any;
	onTaskClick: (task: Task) => void;
	onDeleteTask: (id: string) => void;
}> = ({ task, moveTask, tasks, onTaskClick, onDeleteTask }) => {
	const [{ isDragging }, drag] = useDrag(() => ({
		type: "task",
		item: { id: task._id },
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging(),
		}),
	}));

    

    const dragRef = (element: HTMLDivElement | null) => {
        drag(element)
    }

	return (
		<div ref={dragRef} className={`opacity-${isDragging ? '50' : '100'} transition-opacity duration-200`}>
			<div className="mb-4 bg-white border border-gray-200 rounded-lg shadow-sm">
				<div
					key={task._id}
					className="p-4 flex justify-between items-start"
				>
					<div className="w-2/3 pr-4">
						<h3 className="font-semibold text-gray-800 truncate">{task.title}</h3>
						{task.description && (
							<p className="text-sm text-gray-600 mt-1 line-clamp-2">
								{task.description}
							</p>
						)}
					</div>
					<div className="w-1/3 flex flex-col items-end space-y-2">
						<div className="flex flex-wrap justify-end gap-1">
							<span
								className={`px-2 py-1 rounded-full text-xs font-medium ${
									task.priority === "high"
										? "bg-red-100 text-red-800"
										: task.priority === "medium"
										? "bg-yellow-100 text-yellow-800"
										: "bg-green-100 text-green-800"
								}`}
							>
								{task.priority}
							</span>
							<span
								className={`px-2 py-1 rounded-full text-xs font-medium ${
									task.status === "todo"
										? "bg-gray-100 text-gray-800"
										: task.status === "inprogress"
										? "bg-blue-100 text-blue-800"
										: "bg-green-100 text-green-800"
								}`}
							>
								{task.status}
							</span>
						</div>
						{task.dueDate ? (
							<span className="text-xs text-gray-500">
								{format(new Date(task.dueDate), "MMM d, yyyy")}
							</span>
						) : (
							<span className="text-xs text-gray-400">
								No due date
							</span>
						)}
						<div className="flex space-x-2">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => onTaskClick(task)}
								className="text-blue-600 hover:text-blue-800"
							>
								Edit
							</Button>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => onDeleteTask(task._id)}
								className="text-red-600 hover:text-red-800"
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const Column: React.FC<{
	title: string;
	tasks: Task[];
	status: "todo" | "inprogress" | "completed";
	moveTask: (id: string, status: "todo" | "inprogress" | "completed") => void;
	onTaskClick: (task: Task) => void;
	onDeleteTask: (id: string) => void;
}> = ({ title, tasks, status, moveTask, onTaskClick, onDeleteTask }) => {
	const [, drop] = useDrop(() => ({
		accept: "task",
		drop: (item: { id: string }) => moveTask(item.id, status),
	}));

    const dropRef = (element: HTMLDivElement | null) => {
        drop(element)
    }

	return (
		<div
			ref={dropRef}
			className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm flex-1 min-h-[500px] w-full"
		>
			<h2 className="text-xl font-bold mb-4 text-gray-700">{title}</h2>
			{tasks.map((task) => (
				<TaskCard
					key={task._id}
					task={task}
					tasks={tasks}
					moveTask={moveTask}
					onTaskClick={onTaskClick}
					onDeleteTask={onDeleteTask}
				/>
			))}
		</div>
	);
};

const KanbanBoard = ({ onTaskClick, onDeleteTask }) => {
	const [tasks, setTasks] = useState<Task[]>();

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
	const token = getCookie("token");

	console.log(token);
	useEffect(() => {
		async function handlesubmission() {
            if (token) {
                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            } else {
                window.location.href = "/login";
            }
            
            const response = await axios.get(baseUrl + "/api/");
            if (response.status !== 200) {
                window.location.href = "/login";
            }

			const res = await axios.get(`${baseUrl}/api/tasks`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			if (res) setTasks(res.data.tasks);

			revaldatePathCache("/tasks");
			return;
		}
		handlesubmission();
	}, []);

	const moveTask = async (
		id: string,
		newStatus: "todo" | "inprogress" | "completed"
	) => {
		if (!tasks) return;
		for (let i = 0; i < tasks?.length; i++) {
			if (tasks[i]._id === id) {
				await axios.put(
					"http://localhost:4000/" + "api/tasks/" + id,
					{ ...tasks[i], status: newStatus },
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				break;
			}
		}
		setTasks((prevTasks: any) =>
			prevTasks.map((task: any) =>
				task._id === id ? { ...task, status: newStatus } : task
			)
		);
	};

	if (!tasks)
		return (
			<div className="w-full h-[80vh] flex justify-center items-center">
				<p className="text-gray-600 text-lg">Loading...</p>
			</div>
		);

	return (
		<DndProvider backend={HTML5Backend}>
			<div className="p-4 md:p-8 bg-gray-100 min-h-screen">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<Column
						title="To Do"
						tasks={tasks.filter((task) => task.status === "todo")}
						status="todo"
						moveTask={moveTask}
						onTaskClick={onTaskClick}
						onDeleteTask={onDeleteTask}
					/>
					<Column
						title="In Progress"
						tasks={tasks.filter(
							(task) => task.status === "inprogress"
						)}
						status="inprogress"
						moveTask={moveTask}
						onTaskClick={onTaskClick}
						onDeleteTask={onDeleteTask}
					/>
					<Column
						title="Completed"
						tasks={tasks.filter(
							(task) => task.status === "completed"
						)}
						status="completed"
						moveTask={moveTask}
						onTaskClick={onTaskClick}
						onDeleteTask={onDeleteTask}
					/>
				</div>
			</div>
		</DndProvider>
	);
};

export default KanbanBoard;