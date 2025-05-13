import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const response = await fetch("http://localhost:8000/api/v1/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { detail: data.detail || "Registration failed" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { detail: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
