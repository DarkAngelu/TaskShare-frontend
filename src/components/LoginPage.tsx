import axios from "axios";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

async function login(formData: any) {
	const username = formData.get("username");
	const password = formData.get("password");
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

	let response;

	try {
		response = await axios.post(baseUrl + "/api/auth/login", {
			username: username,
			password: password,
		});
	} catch (e: any) {
		if (e.status === 403) {
			console.log(e.response.data.msg);
		} else {
			console.log("Error occurred, check your credentials\n" + e);
		}
		return;
	}

	if (response.status === 200) {
		const token = response.data.token;
		cookies().set("token", token);
		redirect("/tasks");
	}
}

export default function LoginPage() {
	return (
		<>
			<form 
                className="flex items-center justify-center min-h-screen bg-gray-100"
                action={async (e) => {
                    "use server"
                    await login(e)
                }}
            >
				<div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-md">
					<div className="space-y-2 text-center">
						<h1 className="text-3xl font-bold text-gray-800">Login</h1>
					</div>
					<div className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="username" className="text-gray-700">
								Username
							</Label>
							<Input
								name="username"
								id="username"
                                type="text"
								placeholder="Enter your username"
								required
								className="bg-gray-50 border-gray-300 placeholder-gray-400 text-gray-900 focus:border-gray-500"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password" className="text-gray-700">
								Password
							</Label>
							<Input
								name="password"
								id="password"
								type="password"
								placeholder="Enter your password"
								required
								className="bg-gray-50 border-gray-300 placeholder-gray-400 text-gray-900 focus:border-gray-500"
							/>
						</div>
						<Button
							className="w-full bg-gray-800 hover:bg-gray-700 text-white"
							type="submit"
						>
							Login
						</Button>
					</div>
					<div className="text-center">
						<Link href="/signup">
							<Button
								variant="link"
								className="text-sm text-gray-600 hover:text-gray-800"
							>
								Don't have an account? Sign up
							</Button>
						</Link>
					</div>
				</div>
			</form>
		</>
	);
}