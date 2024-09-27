import { Label } from "@radix-ui/react-label";
import axios from "axios";
import { redirect } from "next/navigation";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";

async function signup(formData: any) {
	const username = formData.get("username");
	const password = formData.get("password");
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

	let response;

	try {
		response = await axios.post(baseUrl + "/api/auth/signup", {
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
		redirect("/login");
	}
}

export default function SignupPage() {
	return (
		<>
			<form 
                className="flex items-center justify-center min-h-screen bg-gray-100"
                action={async (e) => {
                    "use server"
                    await signup(e)
                }}
            >
				<div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-md">
					<div className="space-y-2 text-center">
						<h1 className="text-3xl font-bold text-gray-800">
							Create Account
						</h1>
					</div>
					<div className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="username" className="text-gray-700">
								Username
							</Label>
							<Input
								id="username"
								name="username"
                                type="text"
								placeholder="Choose a username"
								required
								className="bg-gray-50 border-gray-300 placeholder-gray-400 text-gray-900 focus:border-gray-500"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password" className="text-gray-700">
								Password
							</Label>
							<Input
								id="password"
								name="password"
								type="password"
								placeholder="Create a password"
								required
								className="bg-gray-50 border-gray-300 placeholder-gray-400 text-gray-900 focus:border-gray-500"
							/>
						</div>
						<Button
							className="w-full bg-gray-800 hover:bg-gray-700 text-white"
							type="submit"
						>
							Sign Up
						</Button>
					</div>
					<div className="text-center">
						<Link href="/login">
							<Button
								variant="link"
								className="text-sm text-gray-600 hover:text-gray-800"
							>
								Already have an account? Log in
							</Button>
						</Link>
					</div>
				</div>
			</form>
		</>
	);
}