"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { deleteAnswer } from "@/lib/actions/answer.action";
import { deleteQuestion } from "@/lib/actions/question.action";
import Swal from "sweetalert2";

interface Props {
  type: string;
  itemId: string;
}
const EditDeleteAction = ({ type, itemId }: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleEdit = () => {
    if (type === "Question") {
      router.push(`/question/edit/${JSON.parse(itemId)}`);
    } else if (type === "Answer") {
      console.log("🚀 ~ handleEdit ~ JSON.parse(itemId):", JSON.parse(itemId));
      router.push(`/edit-answer/${JSON.parse(itemId)}`);
    }
  };

  const handleDelete = async () => {
    // Mark function as async
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      if (type === "Question") {
        await deleteQuestion({
          questionId: JSON.parse(itemId),
          path: pathname,
          isQuestionPath: pathname === `/question/${JSON.parse(itemId)}`,
        });
      } else if (type === "Answer") {
        await deleteAnswer({ answerId: JSON.parse(itemId), path: pathname });
      }
    } else {
      console.log("User canceled the delete action");
    }
  };

  return (
    <div className="flex items-center justify-end gap-3 max-sm:w-full">
      <Image
        src="/assets/icons/edit.svg"
        alt="Edit"
        width={14}
        height={14}
        className="cursor-pointer"
        onClick={handleEdit}
      />

      <Image
        src="/assets/icons/trash.svg"
        alt="Delete"
        width={14}
        height={14}
        className="cursor-pointer"
        onClick={handleDelete}
      />
    </div>
  );
};

export default EditDeleteAction;
