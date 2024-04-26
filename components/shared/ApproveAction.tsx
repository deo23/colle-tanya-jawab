"use client"
import { markAnswerAsApproved } from "@/lib/actions/answer.action";
import { usePathname } from "next/navigation";

interface ApprovedActionProps {
  answerId: string;
  userId: string;
}

const ApprovedAction = ({ answerId }: ApprovedActionProps) => {
  const pathname = usePathname();

  const handleApprove = async () => {
    try {
      await markAnswerAsApproved({ answerId, path: pathname });
      // Handle success, maybe show a message or update UI
    } catch (error) {
      // Handle error, maybe show an error message or retry mechanism
      console.error("Error approving answer:", error);
    }
  };

  return (
    <button
      className="cursor-pointer"
      onClick={handleApprove}
    >
      Approve
    </button>
  );
};

export default ApprovedAction;
