import { redirect } from "next/navigation";

import Question from "@/components/forms/Question";

import { getUserById } from "@/lib/actions/user.action";
import type { Metadata } from "next";
import { currentProfile } from "@/lib/fetchUserData";

export const metadata: Metadata = {
  title: "Ask a Question — Colle Tanya Jawab",
};

const Page = async () => {
  // const { userId } = auth();
  const user = await currentProfile();
  const userId = user._id.toString();

  if (!userId) return null;
  // const userId = "65f62faac47e266eaaaff298"
  const mongoUser = await getUserById({ userId });
  if (!mongoUser?.onboarded) redirect("/onboarding");

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a Question</h1>

      <div className="mt-9">
        <Question type="create" mongoUserId={JSON.stringify(mongoUser._id)} />
      </div>
    </div>
  );
};

export default Page;
