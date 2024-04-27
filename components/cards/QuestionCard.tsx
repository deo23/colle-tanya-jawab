import Link from "next/link";

import RenderTag from "@/components/shared/RenderTag";
import Metric from "@/components/shared/Metric";
import EditDeleteAction from "@/components/shared/EditDeleteAction";
import { currentProfile } from "@/lib/fetchUserData";

import { getFormattedNumber, getTimestamp } from "@/lib/utils";

interface QuestionProps {
  _id: string;
  title: string;
  tags: Array<{ _id: string; name: string }>;
  author: {
    _id: string;
    name: string;
    role: string;
    picture: string;
    userId: string;
  };
  upvotes: string[];
  views: number;
  answers: Array<object>;
  anonymous: Boolean; 
  approved: Boolean; 
  createdAt: Date;
  userId?: string | null;
}

const QuestionCard = ({
  _id,
  title,
  tags,
  author,
  upvotes,
  views,
  answers,
  anonymous,
  approved,
  createdAt,
  userId,
}: QuestionProps) => {
  const showActionButtons = userId && userId === author.userId;
  

  return (
    <div className="card-wrapper p-9 sm:px-11 rounded-[10px] shadow-2xl" style={{ backgroundColor: 'rgba(238,238,238,255)' }} >
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimestamp(createdAt)}
          </span>
          <Link href={`/question/${_id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex items-center">
            <div className="flex items-center ml-auto">
            {approved && (
              <img
                src="/assets/images/approved.png"
                alt="Approved"
                width={23}
                height={23}
                className="mr-2"
              />
            )}
          </div>
              {title}
              {/* Tambahkan elemen div untuk mengelompokkan judul dan gambar */}
            </h3>
          </Link>
        </div>

        {/* <SignedIn> */}
          {showActionButtons && (
            <EditDeleteAction type="Question" itemId={JSON.stringify(_id)} />
          )}
        {/* </SignedIn> */}
      </div>

      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
        ))}
      </div>

      <div className="flex w-full flex-wrap justify-between mt-6 gap-3">
        {!anonymous && (
          <div className="flex items-center gap-3">
            <Metric
              imgUrl={author.picture}
              alt="user"
              value={`${author.name} \u2022 ${author.role}`}
              title={` asked ${getTimestamp(createdAt)}`}
              href={`/profile/${author._id}`}
              isAuthor
              textStyles="body-medium text-dark400_light700"
            />
          </div>
        )}

        {anonymous && (
          <div className="flex items-center gap-3">
            <Metric
              imgUrl= "/assets/images/anonymous.png"
              alt="user"
              value= "Anonymous"
              title={` • asked ${getTimestamp(createdAt)}`}
              href={`/profile/${author._id}`}
              isAuthor
              textStyles="body-medium text-dark400_light700"
            />
          </div>
        )}

        {/* Uncommented Metric */}
        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          <Metric
            imgUrl="/assets/icons/like.svg"
            alt="Upvotes"
            value={getFormattedNumber(upvotes.length)}
            title=" Votes"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/message.svg"
            alt="Message"
            value={getFormattedNumber(answers.length)}
            title=" Answers"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/eye.svg"
            alt="Eye"
            value={getFormattedNumber(views)}
            title=" Views"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>  
    </div>
  );
};

export default QuestionCard;
