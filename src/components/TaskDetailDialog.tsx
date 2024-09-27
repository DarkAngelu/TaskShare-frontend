import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { DatePickerDemo } from "./DatePickerDemo";
import { Button } from "./ui/button";


type Task = {
	_id: string;
	title: string;
	description?: string;
	status: "todo" | "inprogress" | "completed";
	priority: "low" | "medium" | "high";
	dueDate?: Date;
};

export default function TaskDetailDialog({
	task,
	onClose,
	onUpdate,
	onDelete,
	isNewTask = false,
}) {
	const [editedTask, setEditedTask] = useState(task);

	const handleChange: any = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		setEditedTask({ ...editedTask, [e.target.name]: e.target.value });
	};

	const handleDateChange = (date: Date | undefined) => {
		setEditedTask({ ...editedTask, dueDate: date });
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onUpdate(editedTask); // Ensure editedTask has the updated dueDate
	};

	return (
		<Dialog open={true} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						{isNewTask ? "Add Task" : "Task Details"}
					</DialogTitle>
					<DialogDescription>
						{isNewTask ? "Add a new task" : "Edit task details below"}
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<Label htmlFor="title">Title</Label>
						<Input
							id="title"
							name="title"
							value={editedTask.title}
							onChange={handleChange}
							required
						/>
					</div>
					<div>
						<Label htmlFor="description">Description (Optional)</Label>
						<Textarea
							id="description"
							name="description"
							value={editedTask.description || ""}
							onChange={handleChange}
						/>
					</div>
					<div>
						<Label htmlFor="status">Status</Label>
						<Select
							name="status"
							value={editedTask.status}
							onValueChange={(value) =>
								setEditedTask({
									...editedTask,
									status: value as Task["status"],
								})
							}
						>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Status.." />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="todo">To Do</SelectItem>
								<SelectItem value="inprogress">In Progress</SelectItem>
								<SelectItem value="completed">Completed</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div>
						<Label htmlFor="priority">Priority</Label>
						<Select
							name="priority"
							value={editedTask.priority}
							onValueChange={(value) =>
								setEditedTask({
									...editedTask,
									priority: value as Task["priority"],
								})
							}
						>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Priority.." />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="low">Low</SelectItem>
								<SelectItem value="medium">Medium</SelectItem>
								<SelectItem value="high">High</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div>
						<Label>Due Date (Optional)</Label>
						<DatePickerDemo
                            selected={editedTask.dueDate}
                            onSelect={handleDateChange}
                            className="rounded-md border"
                        />
					</div>
					<div className="flex justify-between">
						<Button type="submit">
							{isNewTask ? "Add Task" : "Update Task"}
						</Button>
						{!isNewTask && (
							<Button
								variant="destructive"
								onClick={() => onDelete(task._id)}
							>
								Delete Task
							</Button>
						)}
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
