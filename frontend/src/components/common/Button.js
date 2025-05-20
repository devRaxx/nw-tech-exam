export default function Button({
  children,
  variant = "primary",
  fullWidth = false,
  disabled = false,
  type = "button",
  ...props
}) {
  const baseClasses =
    "flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary: "text-white bg-gray-900 hover:bg-gray-800 focus:ring-gray-500",
    secondary:
      "text-gray-700 bg-white border-gray-300 hover:bg-gray-50 focus:ring-gray-500",
  };

  const classes = `${baseClasses} ${variants[variant]} ${
    fullWidth ? "w-full" : ""
  } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`;

  return (
    <button type={type} disabled={disabled} className={classes} {...props}>
      {children}
    </button>
  );
}
