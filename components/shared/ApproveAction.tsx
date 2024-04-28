"use client";
import { markAnswerAsApproved } from "@/lib/actions/answer.action";
import { markQuestionAsApproved } from "@/lib/actions/question.action";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2";

interface ApprovedActionProps {
  answerId: string;
  userId: string;
  questionId: string; // Menambahkan prop questionId
}

const ApprovedAction = ({ answerId, questionId }: ApprovedActionProps) => {
  const pathname = usePathname();

  const handleApprove = async () => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, approve it!",
      });

      if (result.isConfirmed) {
        await markAnswerAsApproved({ answerId, path: pathname });
        await markQuestionAsApproved({ questionId, path: pathname }); // Menyetujui pertanyaan saat tombol "Approve" pada jawaban diklik
        // Handle success, maybe show a message or update UI
      } else {
        console.log("User canceled the delete action");
      }
    } catch (error) {
      // Handle error, maybe show an error message or retry mechanism
      console.error("Error approving answer:", error);
    }
  };

  return (
    // <button
    //   className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900"
    //   onClick={handleApprove}
    // >
    //   Approve
    // </button>
    <div className="ml-3 flex items-center justify-end gap-3 max-sm:w-full">
      {/* <Image
        src="/assets/images/approved1.png"
        alt="Approved"
        width={23}
        height={23}
      /> */}

      <Image
        src="/assets/images/approved1.png"
        alt="Edit"
        width={27}
        height={27}
        className="cursor-pointer"
        onClick={handleApprove}
      />
    </div>
  );
};

export default ApprovedAction;
