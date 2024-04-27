"use client"
import { markAnswerAsApproved } from "@/lib/actions/answer.action";
import { markQuestionAsApproved } from "@/lib/actions/question.action";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import path from "path";


interface ApprovedActionProps {
  answerId: string;
  userId: string;
  questionId: string; // Menambahkan prop questionId
}

const ApprovedAction = ({ answerId, questionId  }: ApprovedActionProps) => {
  const pathname = usePathname();

  const handleApprove = async () => {
    try {
      await markAnswerAsApproved({ answerId, path: pathname });
      await markQuestionAsApproved({questionId, path: pathname}); // Menyetujui pertanyaan saat tombol "Approve" pada jawaban diklik
      // Handle success, maybe show a message or update UI
    } catch (error) {
      // Handle error, maybe show an error message or retry mechanism
      console.error("Error approving answer:", error);
    }
  };

  return (
    <button
      className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900" 
      onClick={handleApprove}
    >
      Approve
    </button>
  );
};



export default ApprovedAction;




