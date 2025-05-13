import { NextResponse } from "next/server";

export async function GET(request, context) {
  try {
    const params = await context.params;
    const postId = params.id;

    const token = request.headers.get("authorization")?.split(" ")[1];
    const response = await fetch(
      `http://localhost:8000/api/v1/comments/post/${postId}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { detail: data.detail || "Failed to fetch comments" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { detail: "An error occurred while fetching comments" },
      { status: 500 }
    );
  }
}

export async function POST(request, context) {
  try {
    const params = await context.params;
    const postId = params.id;

    const token = request.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { detail: "No token provided" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const response = await fetch(
      `http://localhost:8000/api/v1/comments/post/${postId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { detail: data.detail || "Failed to create comment" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { detail: "An error occurred while creating comment" },
      { status: 500 }
    );
  }
}
