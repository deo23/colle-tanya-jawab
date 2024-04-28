import User from "@/database/user.model";
import { connectToDatabase } from "@/lib/mongoose";
import { getUserInfo } from "@/lib/actions/user.action";

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

export async function GET(req: any) {
  try {
    connectToDatabase();

    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const userEmail = searchParams.get("email");

    // Retrieve the user document based on the provided email
    const user = await User.findOne({ email: userEmail });
    const userInfo = await getUserInfo({ userId: user.id });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    // Return user's name, email, and reputation
    const userData = {
      name: user.name,
      email: user.email,
      totalQuestions: userInfo.totalQuestions,
      totalAnswers: userInfo.totalAnswers,
      totalUpvotes: userInfo.totalUpvotes,
    };

    // Return the user data within a valid response
    return new Response(JSON.stringify(userData), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
