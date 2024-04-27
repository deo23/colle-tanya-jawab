import { redirect } from "next/navigation";

import Question from "@/components/forms/Question";

import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";

import type { ParamsProps } from "@/types";
import type { Metadata } from "next";

import { currentProfile } from "@/lib/fetchUserData";


export const metadata: Metadata = {
  title: "Edit Question — DevOverflow",
};

const Page = async ({ params }: ParamsProps) => {
  const user = await currentProfile();
  const userId = user._id.toString();

  if (!userId) return null;

  const mongoUser = await getUserById({ userId });
  if (!mongoUser?.onboarded) redirect("/onboarding");

  const result = await getQuestionById({ questionId: params.id });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>
      <div className="mt-9">
        <Question
          type="Edit"
          mongoUserId={mongoUser._id}
          questionDetails={JSON.stringify(result)}
        />
      </div>
    </>
  );
};

export default Page;
