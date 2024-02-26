import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import Answer from "@/database/answer.model";
import Question from "@/database/question.model";
import User from "@/database/user.model";
import Interaction from "@/database/interaction.model";

import { connectToDatabase } from "@/lib/mongoose";



export async function GET(req: any) {
  try {
    connectToDatabase();

    // Parse the URL string into a URL object
    const url = new URL(req.url);

    // Get the value of the answerId parameter from the search parameters
    const answerId = url.searchParams.get('answerId');
    console.log(answerId);

    const answer = await Answer.findById(answerId).populate(
      "author",
      "_id clerkId name picture"
    );

    if (!answer) {
      return new Response("Answer not found", { status: 404 });
    }

    return new Response(JSON.stringify(answer), {
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
