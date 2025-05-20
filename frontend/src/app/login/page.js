"use client";

import Link from "next/link";
import { LoginForm } from "./components/LoginForm";
import { useLogin } from "./hooks/useLogin";

export default function Login() {
  const {
    username,
    password,
    error,
    showPassword,
    isLoading,
    validationErrors,
    setUsername,
    setPassword,
    setShowPassword,
    handleSubmit,
  } = useLogin();

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <LoginForm
            username={username}
            password={password}
            showPassword={showPassword}
            isLoading={isLoading}
            error={error}
            validationErrors={validationErrors}
            onUsernameChange={(e) => setUsername(e.target.value)}
            onPasswordChange={(e) => setPassword(e.target.value)}
            onTogglePassword={() => setShowPassword((v) => !v)}
            onSubmit={handleSubmit}
          />

          <div className="mt-6">
            <div className="relative">
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="font-medium text-gray-900 hover:text-gray-700"
                  >
                    Register
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
