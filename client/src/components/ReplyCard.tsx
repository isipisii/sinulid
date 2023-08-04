import { FC } from "react";
import { Reply } from "../types/types";
import { useFormatTimeStamp } from "../util/useFormatTimestamp";
import { useAppSelector } from "../features/app/hooks";

interface IReplyCard {
    reply: Reply
    handleDeleteReply: (replyId: string) => Promise<void>
}

const ReplyCard: FC<IReplyCard> = ({ reply, handleDeleteReply }) => {
    const {user: authenticatedUser } = useAppSelector(state => state.auth)
    const { formattedTimeStamp } = useFormatTimeStamp(reply?.createdAt)

    return (
        <div className="w-full p-4 flex gap-3 border-borderColor border-b">
            <img
                src={ reply.creator?.displayed_picture ? reply.creator?.displayed_picture?.url :  "https://greenacresportsmed.com.au/wp-content/uploads/2018/01/dummy-image.jpg"}
                alt=""
                className="h-[30px] w-[30px] rounded-full object-cover"
            /> 
            <div className="flex flex-col w-full gap-2">
                <div className="flex justify-between w-full">
                    <p className="text-white text-xs">{reply.creator.username}</p>
                    <div className="flex items-center">
                        <p className="text-lightText text-xs">{formattedTimeStamp}</p>
                        {authenticatedUser?._id === reply.creator._id && <p className="text-white  text-[.6rem]" onClick={() => handleDeleteReply(reply._id)}>delete</p>}
                    </div>
                </div>
                <p className="text-xs text-[#ffffff] tracking-wide whitespace-pre-line">{reply.content}</p>
            </div>
        </div>
    );
};

export default ReplyCard;
