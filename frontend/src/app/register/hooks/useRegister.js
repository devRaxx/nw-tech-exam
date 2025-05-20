import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export const useRegister = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    const username = formData.username.trim();
    const { password } = formData;

    if (!username) {
      errors.username = "Username is required";
    } else if (username.length < 3) {
      errors.username = "Username must be at least 3 characters long";
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      errors.username =
        "Username can only contain letters, numbers, and underscores";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    } else if (!/(?=.*[a-z])/.test(password)) {
      errors.password = "Password must contain at least one lowercase letter";
    } else if (!/(?=.*[A-Z])/.test(password)) {
      errors.password = "Password must contain at least one uppercase letter";
    } else if (!/(?=.*\d)/.test(password)) {
      errors.password = "Password must contain at least one number";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setValidationErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username.trim(),
          password: formData.password,
        }),
      });

      const registerData = await response.json();

      if (!response.ok) {
        setError(
          registerData.detail || "Registration failed. Please try again."
        );
        return;
      }

      const loginFormData = new FormData();
      loginFormData.append("username", formData.username.trim());
      loginFormData.append("password", formData.password);

      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        body: loginFormData,
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        setError(
          loginData.detail ||
            "Registration successful but automatic login failed. Please try logging in manually."
        );
        return;
      }

      localStorage.setItem("token", loginData.access_token);
      Cookies.set("token", loginData.access_token, {
        expires: 30,
        secure: true,
        sameSite: "strict",
        path: "/",
      });
      router.push("/");
    } catch (error) {
      console.error("Registration error:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    error,
    showPassword,
    isLoading,
    validationErrors,
    handleChange,
    setShowPassword,
    handleSubmit,
  };
};
