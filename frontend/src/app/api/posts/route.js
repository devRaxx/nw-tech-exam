import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    console.log("Token from request:", token);
    const response = await fetch("http://localhost:8000/api/v1/posts/", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { detail: data.detail || "Failed to fetch posts" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { detail: "An error occurred while fetching posts" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { detail: "No token provided" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const response = await fetch("http://localhost:8000/api/v1/posts/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { detail: data.detail || "Failed to create post" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { detail: "An error occurred while creating post" },
      { status: 500 }
    );
  }
}
