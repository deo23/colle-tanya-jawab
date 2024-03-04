import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";

import { FilterQuery } from "mongoose";

import { connectToDatabase } from "@/lib/mongoose";
import console from "console";
import { getTagIdByName } from "@/lib/actions/tag.action";

// Contoh buat di postman
// localhost:3001/api/question?q=question%20%23first%20%23second
export async function GET(req: any) {
  try {
    connectToDatabase();

    const url = new URL(req.url); // Create URL object from request URL
    const searchParams = url.searchParams; // Get search params from URL

    const page = 1;
    const pageSize = 10;
    const q = searchParams.get("q");

    // Mencari search query / keyword
    let searchParamsMatch;
    let searchQuery;
    if (q) {
      searchParamsMatch = q.match(/^\w+/);
      searchQuery = searchParamsMatch ? searchParamsMatch[0] : "";
    }

    // Mencari tag name
    let tagsMatch;
    if (q) {
      tagsMatch = q.match(/#\w+/g);
    }
    let tags: string[] = tagsMatch ? tagsMatch.map((tag) => tag.slice(1)) : [];

    const tagIds = await getTagIdByName(tags);

    // Calculate the number of questions to skip based on the page number and page size
    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Question> = {};

    if (searchQuery || tagIds) {
      const searchCriteria: any = [];

      if (searchQuery) {
        searchCriteria.push({
          $or: [
            { title: { $regex: new RegExp(searchQuery, "i") } },
            { content: { $regex: new RegExp(searchQuery, "i") } },
          ],
        });
      }

      if (tagIds) {
        searchCriteria.push({
          $and: tagIds,
        });
      }

      query.$and = searchCriteria;
    }

    const questions = await Question.find(query)
      .populate({ path: "tags", select: "name" })
      .populate({ path: "author", select: "username" })
      .skip(skipAmount)
      .limit(pageSize);

    if (!questions) {
      return new Response("Question not found", { status: 404 });
    }

    return new Response(JSON.stringify(questions), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
