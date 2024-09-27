"use server"

import axios from "axios";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function revaldatePathCache(path : string) {
    try{
        revalidatePath(path)
    }catch(e){
        console.log(e);
    }
}

export async function getUsername(token: string) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const response = await axios.get(baseUrl + `/api/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })

    if (response.status === 200) {
        redirect("/tasks")
    } else {
        redirect("/login")
    }
}

export async function signOut() {
    cookies().delete("token")
    redirect("/")
}
