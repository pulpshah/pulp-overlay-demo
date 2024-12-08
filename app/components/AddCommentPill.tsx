"use client";

import Image from "next/image";
import { useState } from "react";

type ReplyType = {
  id: number;
  author: string;
  text: string;
  createdAt: string;
  replies?: ReplyType[];
};

type CommentProps = {
  id: number;
  author: string;
  text: string;
  createdAt: string;
  replies: ReplyType[];
  userVoteLevel: number | null;
  isTopLevel: boolean;
};

type AddCommentPillProps = {
  onAddComment: (newComment: CommentProps) => void;
  slug: string;
  email: string;
};

export default function AddCommentPill({
  onAddComment,
  slug,
  email,
}: AddCommentPillProps) {
  const [commentText, setCommentText] = useState("");

  const handleSend = () => {
    if (commentText.trim()) {
      const newComment: CommentProps = {
        id: Date.now(),
        author: email,
        text: commentText,
        createdAt: new Date().toISOString(),
        replies: [],
        userVoteLevel: 3,
        isTopLevel: true,
      };

      // Add the comment to the local state
      onAddComment(newComment);

      // Clear the input field
      setCommentText("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-neutral-800">
      {/* Plus Icon Button */}
      <button
        className="p-2 rounded-md bg-neutral-800 hover:bg-neutral-700 transition-colors"
        onClick={handleSend}
      >
        <Image
          src="/icons/plus-square-icon.png"
          alt="Add"
          width={30}
          height={35}
          className="opacity-90"
        />
      </button>

      {/* Input and Send Button */}
      <div className="flex items-center flex-grow gap-2">
        {/* Input Field */}
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Write a comment..."
            className="w-full bg-black px-3 py-2 rounded-md text-white placeholder-neutral-500 focus:outline-none text-sm"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        {/* Send Button */}
        {commentText.trim() && (
          <button
            onClick={handleSend}
            className="p-2 bg-transparent text-white rounded-md hover:bg-gray-500 transition-colors"
          >
            <Image
              src="/icons/send-icon.svg"
              alt="Send"
              height={28}
              width={28}
            />
          </button>
        )}
      </div>
    </div>
  );
}
