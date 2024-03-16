import User from "@/database/user.model";
import { connectToDatabase } from "@/lib/mongoose";

export async function POST(request: any) {
  try {
    connectToDatabase();

    const requestData = await request.json();
    const { email, username, password } = requestData;

    const newUser = await User.create({ email, username, password });

    // response.status(201).json({ success: true, result: newUser });

    if (!newUser) {
      return new Response("Question not found", { status: 500 });
    }

    // Return the question within a valid response
    return new Response(JSON.stringify(newUser), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log(error);
    // response.status(500).json({ success: false, message: error });
    throw error;
  }
}
