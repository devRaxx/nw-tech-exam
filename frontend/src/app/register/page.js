"use client";

import Link from "next/link";
import { RegisterForm } from "./components/RegisterForm";
import { useRegister } from "./hooks/useRegister";

export default function Register() {
  const {
    formData,
    error,
    showPassword,
    isLoading,
    validationErrors,
    handleChange,
    setShowPassword,
    handleSubmit,
  } = useRegister();

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <RegisterForm
            formData={formData}
            error={error}
            showPassword={showPassword}
            isLoading={isLoading}
            validationErrors={validationErrors}
            onFieldChange={handleChange}
            onTogglePassword={() => setShowPassword((v) => !v)}
            onSubmit={handleSubmit}
          />

          <div className="mt-6">
            <div className="relative">
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-gray-900 hover:text-gray-700"
                  >
                    Sign in
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
