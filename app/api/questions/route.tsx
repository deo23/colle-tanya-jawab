import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";

import { connectToDatabase } from "@/lib/mongoose";

//Get Question based on author ID
export async function GET(req: any) {
  try {
    connectToDatabase();

    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const authorId = searchParams.get("authorId");

    const question = await Question.find({ author: authorId })
      .populate({ path: "tags", model: Tag, select: "_id name" })
      .populate({
        path: "author",
        model: User,
        select: "_id userId name picture",
      });

    if (!question) {
      return new Response("Question not found", { status: 404 });
    }

    // Return the question within a valid response
    return new Response(JSON.stringify(question), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
