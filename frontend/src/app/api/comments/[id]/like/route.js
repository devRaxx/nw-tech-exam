import { NextResponse } from "next/server";

export async function POST(request, context) {
  try {
    const params = await context.params;
    const commentId = params.id;
    const token = request.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { detail: "No token provided" },
        { status: 401 }
      );
    }

    const response = await fetch(
      `http://localhost:8000/api/v1/comments/${commentId}/like`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { detail: data.detail || "Failed to like comment" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { detail: "An error occurred while liking comment" },
      { status: 500 }
    );
  }
}
