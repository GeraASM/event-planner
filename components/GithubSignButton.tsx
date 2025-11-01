'use client'; 
import { login } from "@/lib/auth-actions";
import Image from "next/image";

export function GitHubSignInButton() {
    return (
        <button onClick={login} className="
            hover:bg-gray-950 cursor-pointer
        w-full flex items-center justify-center gap-2 font-medium px-4 py-3 rounded-xl bg-gray-900 text-foreground 
        transition-colors
        ">
            <Image width={40} height={40} className="w-8 h-8" src="/assets/github.svg" alt="GitHub" />
            <p>Continue with GitHub</p>
        </button>
    )
}