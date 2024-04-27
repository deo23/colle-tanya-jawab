import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import Metric from "@/components/shared/Metric";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTag from "@/components/shared/RenderTag";
import AllAnswers from "@/components/shared/AllAnswers";
import Votes from "@/components/shared/Votes";
import EditDeleteAction from "@/components/shared/EditDeleteAction";
import Answer from "@/components/forms/Answer";

import { getUserById } from "@/lib/actions/user.action";
import { getQuestionById } from "@/lib/actions/question.action";

import { getFormattedNumber, getTimestamp } from "@/lib/utils";

import type { URLProps } from "@/types";
import type { Metadata } from "next";

import { currentProfile } from "@/lib/fetchUserData";

export async function generateMetadata({
  params,
}: Omit<URLProps, "searchParams">): Promise<Metadata> {
  const question = await getQuestionById({ questionId: params.id });

  return {
    title: `"${question.title}" — Colle Tanya Jawab`,
  };
}

const Page = async ({ params, searchParams }: URLProps) => {
  const user = await currentProfile();
  const userId = user._id.toString();

  let mongoUser;

  if (userId) {
    mongoUser = await getUserById({ userId });
  } else {
    return redirect("/sign-in");
  }

  const result = await getQuestionById({ questionId: params.id });
  console.log("🚀 ~ Page ~ result - RESULT :", result);
  const userData = await getUserById({ userId: result.author._id });
  console.log("🚀 ~ Page ~ userData:", userData);

  if (!result) return null;

  const showActionButtons = userId && userId === result.author._id.toString();
  console.log("🚀 ~ Page ~ result:", result.author._id.toString());

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          {!result.anonymous && (
            <Link
              href={`/profile/${result.author.userId}`}
              className="mb-8 flex items-center justify-start gap-1"
            >
              <Image
                src={result.author.picture}
                alt="profile"
                className="rounded-full"
                width={22}
                height={22}
              />
              <p className="paragraph-semibold text-dark300_light700">
                {`${result.author.name} \u2022 ${userData.role}`}
              </p>
            </Link>
          )}
          {result.anonymous && (
            <Link
              href={``}
              className="mb-8 flex items-center justify-start gap-1"
            >
              <Image
                src="/assets/images/anonymous.png"
                alt="anonymous"
                className="rounded-full"
                width={22}
                height={22}
              />
              <p className="paragraph-semibold text-dark300_light700">
                Anonymous
              </p>
            </Link>
          )}
          <div className="flex justify-end">
            <Votes
              type="Question"
              itemId={JSON.stringify(result._id)}
              userId={JSON.stringify(mongoUser._id)}
              upvotes={result.upvotes.length}
              hasupVoted={result.upvotes.includes(mongoUser._id)}
              downvotes={result.downvotes.length}
              hasdownVoted={result.downvotes.includes(mongoUser._id)}
              hasSaved={mongoUser?.saved.includes(result._id)}
            />
          </div>
        </div>
      </div>

      <div className="to-dark-900 m-2 rounded-xl bg-gradient-to-br from-light-800 p-6 shadow-lg">
        <h2 className="text-dark-900 mt-3.5 w-full text-left font-semibold">
          <h3 className="text-dark-900 flex items-center truncate font-semibold">
            <span className="ml-2">{result.title}</span>
            {result.approved && (
              <Image
                src="/assets/images/approved.png"
                alt="Approved"
                width={25}
                height={25}
              />
            )}
          </h3>
        </h2>

        <div className="mb-8 mt-5 flex flex-wrap gap-4">
          <Metric
            imgUrl="/assets/icons/clock.svg"
            alt="clock icon"
            value={` asked ${getTimestamp(result.createdAt)}`}
            title=" Asked"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/message.svg"
            alt="Message"
            value={getFormattedNumber(result.answers.length)}
            title=" Answers"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/eye.svg"
            alt="Eye"
            value={getFormattedNumber(result.views)}
            title=" Views"
            textStyles="small-medium text-dark400_light800"
          />
        </div>

        <ParseHTML data={result.content} />

        <div className="my-8 flex flex-row items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            {result.tags.map((tag: any) => (
              <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
            ))}
          </div>

          {/* <SignedIn> */}
          {showActionButtons && (
            <EditDeleteAction
              type="Question"
              itemId={JSON.stringify(result._id)}
            />
          )}
          {/* </SignedIn> */}
        </div>
      </div>

      <div className="from-bg-light-800 to-dark-gradient m-2 rounded-xl border bg-gradient-to-br p-6 shadow-lg">
        <AllAnswers
          questionId={result._id}
          questionAuthor={result.author._id}
          userId={mongoUser._id}
          totalAnswers={result.answers.length}
          filter={searchParams?.filter}
          page={searchParams?.page ? +searchParams.page : 1}
        />
      </div>

      <Answer
        type="Create"
        question={result.content}
        questionId={JSON.stringify(result._id)}
        authorId={JSON.stringify(mongoUser._id)}
      />
    </>
  );
};

export default Page;
