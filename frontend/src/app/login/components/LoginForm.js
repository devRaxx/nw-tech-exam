import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import FormInput from "@/components/common/FormInput";
import Button from "@/components/common/Button";
import ErrorMessage from "@/components/common/ErrorMessage";

export const LoginForm = ({
  username,
  password,
  showPassword,
  isLoading,
  error,
  validationErrors,
  onUsernameChange,
  onPasswordChange,
  onTogglePassword,
  onSubmit,
}) => {
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      {error && <ErrorMessage message={error} />}

      <FormInput
        id="username"
        label="Username"
        type="text"
        value={username}
        onChange={onUsernameChange}
        error={validationErrors.username}
        autoComplete="username"
        required
      />

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <div className="mt-1 relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={onPasswordChange}
            className={`text-black appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 pr-10 ${
              validationErrors.password ? "border-red-500" : ""
            }`}
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={onTogglePassword}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 focus:outline-none"
          >
            {showPassword ? <IoIosEye /> : <IoIosEyeOff />}
          </button>
          {validationErrors.password && (
            <p className="mt-1 text-sm text-red-600">
              {validationErrors.password}
            </p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isLoading} fullWidth variant="primary">
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
};
