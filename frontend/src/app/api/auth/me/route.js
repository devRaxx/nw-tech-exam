import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { detail: "No token provided" },
        { status: 401 }
      );
    }

    const response = await fetch("http://localhost:8000/api/v1/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { detail: data.detail || "Failed to fetch user profile" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { detail: "An error occurred while fetching user profile" },
      { status: 500 }
    );
  }
}
