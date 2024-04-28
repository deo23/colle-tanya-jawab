import { revalidatePath } from "next/cache";

import Answer from "@/database/answer.model";
import Question from "@/database/question.model";
import User from "@/database/user.model";
import Interaction from "@/database/interaction.model";

import { connectToDatabase } from "@/lib/mongoose";

import express from "express";
import console from "console";
const app = express();

// Parse JSON bodies
app.use(express.json());

export async function GET(req: any) {
  try {
    connectToDatabase();

    // Parse the URL string into a URL object
    const url = new URL(req.url);

    // Get the value of the answerId parameter from the search parameters
    const answerId = url.searchParams.get("answerId");

    const answer = await Answer.findById(answerId).populate(
      "author",
      "_id userId name picture",
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

export async function POST(req: Request) {
  try {
    const { content, author, question, path } = await req.json();

    connectToDatabase();

    const newAnswer = await Answer.create({
      content,
      author,
      question,
      path,
    });

    // Add the answer to the question's answers array
    const questionObj = await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    // Create an interaction record for the user's create_answer action
    await Interaction.create({
      user: author,
      action: "answer",
      question,
      answer: newAnswer._id,
      tags: questionObj.tag,
    });

    // Increment author's reputation by +10 for creating an answer
    await User.findByIdAndUpdate(author, { $inc: { reputation: 10 } });

    revalidatePath(path);

    // Return a success response
    return new Response(JSON.stringify(newAnswer), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function PATCH(req: any) {
  try {
    connectToDatabase();

    const { answerId, content } = await req.json();

    const answer = await Answer.findById(answerId);

    if (!answer) {
      return new Response("Answer not found", { status: 404 });
    }

    answer.content = content;

    await answer.save();

    return new Response(JSON.stringify(answer), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function DELETE(req: any) {
  try {
    connectToDatabase();

    const { answerId, path } = await req.json();

    const answer = await Answer.findById(answerId);

    if (!answer) {
      return new Response("Answer not found", { status: 404 });
    }

    await answer.deleteOne({ _id: answerId });

    await Question.updateMany(
      { _id: answer.question },
      { $pull: { answers: answerId } },
    );

    await Interaction.deleteMany({ answer: answerId });

    revalidatePath(path);
    return new Response("Answer deleted successfully", { status: 200 });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
