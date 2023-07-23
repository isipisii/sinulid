import { FC } from "react";
import { Reply } from "../types/types";
import { useFormatTimeStamp } from "../hook/useFormatTimestamp";
import { useAppSelector } from "../features/app/hooks";

interface IReplyCard {
    reply: Reply
    handleDeleteReply: (replyId: string) => Promise<void>
}

const ReplyCard: FC<IReplyCard> = ({ reply, handleDeleteReply }) => {
    const {user: authenticatedUser } = useAppSelector(state => state.auth)
    const { formattedTimeStamp } = useFormatTimeStamp(reply?.createdAt)

    return (
        <div className="w-full p-4 flex gap-3  border-borderColor border-t">
            <img
                src={reply.creator?.displayed_picture?.url}
                alt=""
                className="h-[30px] w-[30px] rounded-full"
            />
            <div className="flex flex-col w-full gap-2">
                <div className="flex justify-between w-full">
                <p className="text-white text-xs">{reply.creator.username}</p>
                <p className="text-lightText text-xs">{formattedTimeStamp}</p>
                </div>
                <p className="text-xs text-[#ffffff] tracking-wide whitespace-pre-line">
                {reply.content}
                </p>
                {authenticatedUser?._id === reply.creator._id && <p className="text-white" onClick={() => handleDeleteReply(reply._id)}>delete</p>}
            </div>
        </div>
    );
};

export default ReplyCard;
