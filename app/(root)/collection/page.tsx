import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import QuestionCard from "@/components/cards/QuestionCard";

import { getSavedQuestions, getUserById } from "@/lib/actions/user.action";

import { QuestionFilters } from "@/constants/filters";

import type { SearchParamsProps } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collection — DevOverflow",
};

export default async function Collection({ searchParams }: SearchParamsProps) {
  // const { userId: authId } = auth();
  const authId = "65dfee47d87246ca81ba274e";
  // const userId = authId;
  if (!authId) return null;

  const mongoUser = await getUserById({ userId: authId });
  if (!mongoUser?.onboarded) redirect("/onboarding");

  const result = await getSavedQuestions({
    authId,
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/collection"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />

        <Filter
          filters={QuestionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {result.questions.length > 0 ? (
          result.questions.map((question: any) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              authId={authId}
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
            title="No Saved Questions Found"
            description="It appears that there are no saved questions in your collection at the moment 😔. Start exploring and saving questions that pique your interest 🌟"
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
}