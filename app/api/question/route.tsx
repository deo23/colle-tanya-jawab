import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";

import { FilterQuery } from "mongoose";

import { connectToDatabase } from "@/lib/mongoose";

// localhost:3001/api/question?keyword=[keyword]&&tagId=[tagId]
// Contoh
// localhost:3001/api/question?keyword=question&&tagId=65d5ed4c4d17823db461cab5
// Contoh 2 tag dipisah menggunakan koma (%2C)
// localhost:3001/api/question?keyword=question&&tagId=65d5ed4c4d17823db461cab5%2C65e25f2c5a9981a64cf79ffb
export async function GET(req: any) {
  try {
    connectToDatabase();

    const url = new URL(req.url); // Create URL object from request URL
    const searchParams = url.searchParams; // Get search params from URL

    const page = 1;
    const pageSize = 10;
    const searchQuery = searchParams.get("keyword");
    const tagId = searchParams.get("tagId");

    // Mengkonversi string menjadi array
    let tagIds;
    if (tagId) {
      tagIds = tagId.split(",");
    }

    // Calculate the number of questions to skip based on the page number and page size
    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Question> = {};

    if (searchQuery || tagId) {
      const searchCriteria: any = [];

      if (searchQuery) {
        searchCriteria.push({
          $or: [
            { title: { $regex: new RegExp(searchQuery, "i") } },
            { content: { $regex: new RegExp(searchQuery, "i") } },
          ],
        });
      }

      // Mengubah array menjadi objek
      let tagOrConditions;
      if (tagIds) {
        tagOrConditions = tagIds.map((tag) => ({ tags: tag }));
      }

      if (tagOrConditions) {
        searchCriteria.push({
          $and: tagOrConditions,
        });
      }

      query.$and = searchCriteria;
    }
    console.log(query, "<< Query");
    const questions = await Question.find(query)
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
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
