import Link from "next/link";
import { Button } from "@/components/ui/button";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import SearchInput from "@/components/shared/search/Search";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import HomeFilters from "@/components/shared/Filters";
import QuestionCard from "@/components/cards/QuestionCard";
import { useState } from "react";

import {
  getQuestions,
  getRecommendedQuestions,
} from "@/lib/actions/question.action";

import { HomePageFilters } from "@/constants/filters";

import type { SearchParamsProps } from "@/types";
import type { Metadata } from "next";
import { currentProfile } from "@/lib/fetchUserData";


export const metadata: Metadata = {
  title: "Home — DevOverflow",
};

export default async function Home({ searchParams }: SearchParamsProps) {

  // const { userId: userId } = auth();
  const user = await currentProfile();
  const userId = user._id.toString();
  
  console.log("🚀 ~ Home ~ user:", user._id.toString())

  let result;

  if (searchParams?.filter === "recommended") {
    if (userId) {
      result = await getRecommendedQuestions({
        userId: userId,
        searchQuery: searchParams.q,
        page: searchParams.page ? +searchParams.page : 1,
      });
    } else {
      result = {
        questions: [],
        isNext: false,
      };
    }
  } else {
    result = await getQuestions({
      searchQuery: searchParams.q,
      filter: searchParams.filter,
      page: searchParams.page ? +searchParams.page : 1,
    });
  }

  // const [searchInput, setSearchInput] = useState('');

  // const handleSearch = () => {
  //   // Mengubah nilai input pencarian ke dalam format yang diinginkan untuk parameter API
  //   const formattedSearchQuery = searchInput.replace(/#/g, '%23').replace(/\s/g, '%20');

  //   // Memanggil API dengan parameter yang telah diformat
  //   fetch(`http://localhost:3001/api/question?q=${formattedSearchQuery}`)
  //       .then(response => {
  //           if (!response.ok) {
  //               throw new Error('Network response was not ok');
  //           }
  //           return response.json();
  //       })
  //       .then(data => {
  //           // Lakukan sesuatu dengan data yang diperoleh dari API (misalnya, tampilkan hasil di UI)
  //           console.log(data);
  //       })
  //       .catch(error => {
  //           console.error('There has been a problem with your fetch operation:', error);
  //       });
  // };

  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>

      <div className="mt-11 w-full">
        <div className="flex items-center justify-between max-sm:flex-col max-sm:items-start">
          <SearchInput/>
        </div>
      </div>

      <HomeFilters filters={HomePageFilters} />

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
            title="No Questions Found"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
          discussion. our query could be the next big thing others learn from. Get
          involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
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
