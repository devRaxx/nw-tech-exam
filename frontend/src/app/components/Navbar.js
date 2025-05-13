"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { PiSignInBold } from "react-icons/pi";
import { RiLogoutBoxLine } from "react-icons/ri";
import Cookies from "js-cookie";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      fetch("http://localhost:8000/api/v1/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setUser(data))
        .catch(() => {
          Cookies.remove("token");
          setUser(null);
        });
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    setUser(null);
    router.push("/home");
  };

  return (
    <nav className="border-b border-gray-200 bg-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/home" className="text-2xl font-bold text-yellow-400">
              NuWorks Blogsite
            </Link>
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-gray-200">
                  <span className="text-gray-400">Logged in as</span>
                  <span className="ml-2 font-medium text-yellow-400">
                    {user.username}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-black bg-yellow-400 rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  <RiLogoutBoxLine /> Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-black bg-yellow-400 rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <PiSignInBold /> Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
