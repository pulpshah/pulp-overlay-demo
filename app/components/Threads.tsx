"use client";

import React, { useState } from "react";
import Comment from "./Comment";
import AddCommentPill from "./AddCommentPill";
import SelfComment from "./SelfComment";
import Image from "next/image";
import RelatedMediaTemplates from "./RelatedMediaTemplate";

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

export default function Threads({
  comments,
  email,
  isExpanded,
  disableScroll,
  onDisableScroll,
}: {
  comments: CommentProps[];
  email: string;
  isExpanded: boolean;
  disableScroll: boolean;
  onDisableScroll: (disable: boolean) => void;
}) {
  const [userComments, setUserComments] = useState<CommentProps[]>([]);

  const handleAddComment = (newComment: CommentProps) => {
    setUserComments((prevComments) => [...prevComments, newComment]);
  };

  const sortedComments = [...comments, ...userComments].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const commentCount = sortedComments.length;

  return (
    <div className="flex flex-col h-full bg-[#2E2E2E] overflow-hidden rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#595959]">
        <div className="flex items-center gap-3">
          <Image
            src="/icons/comments-filled-icon.svg"
            alt="Comments"
            width={24}
            height={24}
          />
          <div className="flex items-center gap-2">
            <span className="text-[#FFFFFF] font-semibold text-lg">Comments</span>
            <span className="text-[#7E7E7E]">({commentCount})</span>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div
        className={`flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#595959] scrollbar-track-[#2E2E2E] ${
          disableScroll ? "overflow-hidden" : ""
        }`}
      >
        <div className="space-y-2 p-2">
          {sortedComments.map((comment) => (
            comment.author === email ? (
              <SelfComment
                key={comment.id}
                id={comment.id}
                text={comment.text}
                author={comment.author}
                createdAt={comment.createdAt}
                email={email}
                isExpanded={isExpanded}
                initialReplies={comment.replies}
              />
            ) : (
              <Comment
                key={comment.id}
                commentText={comment.text}
                author={comment.author}
                commentIndex={comment.id}
                isExpanded={isExpanded}
                replies={comment.replies}
                isMinimized={!isExpanded}
                email={email}
                startingVoteLevel={comment.userVoteLevel}
              />
            )
          ))}
        </div>
      </div>

      {/* Add Comment Input */}
      <div className="sticky bottom-0 w-full px-2 py-2 bg-neutral-800 border-t border-gray-700">
        <AddCommentPill
          onAddComment={handleAddComment}
          slug={"placeholder-slug"}
          email={email}
        />
      </div>
    </div>
  );
}
