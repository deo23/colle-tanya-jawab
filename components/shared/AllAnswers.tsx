import Link from "next/link";
import Image from "next/image";

import Filter from "@/components/shared/Filter";
import ParseHTML from "@/components/shared/ParseHTML";
import Votes from "@/components/shared/Votes";
import Pagination from "@/components/shared/Pagination";
import EditDeleteAction from "@/components/shared/EditDeleteAction";
// import { approveAnswer, approveQuestion } from "@/lib/actions/question.action";

import { getAnswers } from "@/lib/actions/answer.action";
import { getTimestamp } from "@/lib/utils";
import { getQuestionById } from "@/lib/actions/question.action";

import { AnswerFilters } from "@/constants/filters";
import ApprovedAction from "@/components/shared/ApproveAction"; // Import the ApprovedAction component

import type {
  QuestionId,
  UserId,
  OptionalPage,
  OptionalFilter,
} from "@/lib/actions/shared.types";

interface Props extends QuestionId, UserId, OptionalPage, OptionalFilter {
  totalAnswers: number;
  questionAuthor: string;
}

const AllAnswers = async ({
  userId,
  questionId,
  totalAnswers,
  questionAuthor,
  filter,
  page,
}: Props) => {
  const result = await getAnswers({
    questionId,
    sortBy: filter,
    page,
  });
  const question = await getQuestionById({ questionId });

  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">{totalAnswers} Answers</h3>
        <Filter filters={AnswerFilters} />
      </div>
      <div className="">
        {result.answers.map((answer: any) => {
          const showActionButtons =
            userId.toString() === answer.author._id.toString();
          const myQuestion =
            userId.toString() === question.author._id.toString();
          const notMyAnswer =
            JSON.stringify(userId) !== JSON.stringify(answer.author._id);
          const approved = question.approved;

          return (
            <article key={answer._id} className="light-border border-b py-10">
              <div className="mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
                <Link
                  href={`/profile/${answer.author.userId}`}
                  className="flex flex-1 items-start gap-1 sm:items-center"
                >
                  <Image
                    src={answer.author.picture}
                    width={18}
                    height={18}
                    alt="profile"
                    className="rounded-full object-cover max-sm:mt-0.5"
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <p className="body-semibold text-dark300_light700">
                      {/* {answer.author.name} */}
                      {`${answer.author.name} \u2022 ${answer.author.role}`}
                    </p>
                    <p className="small-regular text-light400_light500 ml-0.5 mt-0.5 line-clamp-1">
                      <span className="max-sm:hidden">• answered </span>
                      {getTimestamp(answer.createdAt)}
                    </p>
                  </div>
                </Link>
                <div className="flex justify-end">
                  <h3>
                    {answer.approved && (
                      <Image
                        src="/assets/images/approved2.png"
                        alt="Approved"
                        width={23}
                        height={23}
                      />
                    )}
                  </h3>
                  <Votes
                    type="Answer"
                    itemId={JSON.stringify(answer._id)}
                    userId={JSON.stringify(userId)}
                    upvotes={answer.upvotes.length}
                    hasupVoted={answer.upvotes.includes(userId)}
                    downvotes={answer.downvotes.length}
                    hasdownVoted={answer.downvotes.includes(userId)}
                  />
                  {!approved && notMyAnswer && myQuestion && (
                    <ApprovedAction
                      questionId={questionId}
                      answerId={answer._id}
                      userId={userId}
                    /> // Replace the placeholder button with the ApprovedAction component
                  )}
                </div>
              </div>
              <ParseHTML data={answer.content} />

              {/* <SignedIn> */}
              {showActionButtons && (
                <EditDeleteAction
                  type="Answer"
                  itemId={JSON.stringify(answer._id)}
                />
              )}

              {/* </SignedIn> */}
            </article>
          );
        })}
      </div>

      <div className="mt-10 w-full">
        <Pagination pageNumber={page ? +page : 1} isNext={result.isNext} />
      </div>
    </div>
  );
};

export default AllAnswers;
