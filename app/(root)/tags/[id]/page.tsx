import { auth } from "@clerk/nextjs";

import QuestionCard from "@/components/cards/QuestionCard";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";

import { getTagById, getQuestionsByTagId } from "@/lib/actions/tag.action";

import type { URLProps } from "@/types";
import type { Metadata } from "next";
import { currentProfile } from "@/lib/fetchUserData";
import QuestionCard from "@/components/cards/QuestionCard";


export async function generateMetadata({
  params,
}: Omit<URLProps, "searchParams">): Promise<Metadata> {
  const tag = await getTagById({ tagId: params.id });

  return {
    title: `Posts by tag '${tag.name}' — DevOverflow`,
    description: tag.description || `Questions tagged with ${tag.name}`,
  };
}

const Page = async ({ params, searchParams }: URLProps) => {
  // const { userId: userId } = auth();
  //const userId = "65ebb3d12f7d3011af8cb203"
  const user = await currentProfile();
  const userId = user._id.toString();
  

  const result = await getQuestionsByTagId({
    tagId: params.id,
    searchQuery: searchParams.q,
    page: searchParams.page ? +searchParams.page : 1,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">{result.tagTitle}</h1>
      <div className="mt-11 w-full">
        <LocalSearchbar
          route={`/tags/${params.id}`}
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search tag questions"
          otherClasses="flex-1"
        />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {result.questions.length > 0 ? (
          result.questions.map((question: any) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              userId={userId}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="No Tag Questions Found"
            description="It appears that there are no saved questions in your collection at the moment 😔.Start exploring and saving questions that pique your interest 🌟"
            link="/"
            linkTitle="Explore Questions"
          />
        )}
      </div>

      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </>
  );
};

export default Page;
