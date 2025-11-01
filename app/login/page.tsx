import { GitHubSignInButton } from "@/components/GithubSignButton"
import { auth } from "@/auth";
import { redirect } from "next/navigation";
export default async function LoginPage() {

    const session = await auth();
    if (session) {
        redirect("/dashboard");
    }
    return (
        <div className="min-h-[700px] flex items-center justify-center">
            <div className="max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-foreground font-bold text-3xl">Welcome</h1>
                    <p className="text-muted mt-2" >Sign in or create an account to continue</p>
                </div>
                <div className="card p-8">
                    <div className="space-y-6">
                        <div className="text-center text-foreground/40">
                            <p>Use your GitHub account to sign in or create a new account</p>
                        </div>
                    </div>
                    <GitHubSignInButton />
                    <div className="text-start mt-4">
                        <p className="text-sm text-muted">By signing in, you agree to our terms of service and privacity policy</p>
                    </div>
                </div>
            </div>
          
        </div>
    )
}