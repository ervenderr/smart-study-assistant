import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Smart Study Assistant</h1>
        {user ? (
          <div>
            <p>Welcome back, {user.name || "User"}!</p>
            <div className="mt-4">
              <Link
                href="/dashboard"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <p>Please log in to continue</p>
            <div className="mt-4 space-x-4">
              <Link
                href="/login"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
