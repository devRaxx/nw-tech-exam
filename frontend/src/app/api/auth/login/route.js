import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const response = await fetch("http://localhost:8000/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        username: formData.get("username"),
        password: formData.get("password"),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { detail: data.detail || "Login failed" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { detail: "An error occurred during login" },
      { status: 500 }
    );
  }
}
