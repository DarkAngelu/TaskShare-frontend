import { format } from "date-fns";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";

type Task = {
	_id: string;
	title: string;
	description?: string;
	status: "todo" | "inprogress" | "completed";
	priority: "low" | "medium" | "high";
	dueDate?: Date | null;
};

export default function ListView({ tasks, onTaskClick, onDeleteTask } ) {
	return (
		<div className="space-y-2">
			{tasks.map((task) => (
				<div
					key={task._id}
					className="bg-white p-4 rounded shadow flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0"
				>
					<div>
						<h3 className="font-semibold">{task.title}</h3>
						{task.description && (
							<p className="text-sm text-gray-600">
								{task.description}
							</p>
						)}
					</div>
					<div className="flex flex-wrap items-center space-x-2">
						<span
							className={`px-2 py-1 rounded text-xs ${
								task.priority === "high"
									? "bg-red-200 text-red-800"
									: task.priority === "medium"
									? "bg-yellow-200 text-yellow-800"
									: "bg-green-200 text-green-800"
							}`}
						>
							{task.priority}
						</span>
						<span
							className={`px-2 py-1 rounded text-xs ${
								task.status === "todo"
									? "bg-gray-200 text-gray-800"
									: task.status === "inprogress"
									? "bg-blue-200 text-blue-800"
									: "bg-green-200 text-green-800"
							}`}
						>
							{task.status}
						</span>
						{task.dueDate ? (
							<span className="text-xs text-gray-500">
								{format(task.dueDate, "MMM d, yyyy")}
							</span>
						) : (
							<span className="text-xs text-gray-400">
								No due date
							</span>
						)}
						<Button
							variant="ghost"
							size="sm"
							onClick={() => onTaskClick(task)}
						>
							Edit
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => onDeleteTask(task._id)}
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					</div>
				</div>
			))}
		</div>
	);
}
