import { useState, useEffect } from "react";

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch user data");

        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        localStorage.removeItem("token");
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return { user };
};
