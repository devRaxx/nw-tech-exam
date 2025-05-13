import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    const commentId = params.id;

    if (!token) {
      return NextResponse.json(
        { detail: "No token provided" },
        { status: 401 }
      );
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/comments/${commentId}/dislike`,
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
        { detail: data.detail || "Failed to dislike comment" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { detail: "An error occurred while disliking comment" },
      { status: 500 }
    );
  }
}
