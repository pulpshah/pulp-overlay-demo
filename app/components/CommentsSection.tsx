"use client";

import { useState } from "react";
import Threads from "./Threads";
import CommentsButton from "./CommentsButton";
import ArrowButton from "./ArrowButton";
import TopPill from "./TopPill";

type Comment = {
  id: number;
  author: string;
  text: string;
  createdAt: string;
  replies: Comment[];
  userVoteLevel: number | null;
  isTopLevel: boolean;
};

export default function CommentsSection() {
  const [showComments, setShowComments] = useState(false);
  const [expandComments, setExpandComments] = useState(false);
  const [disableScroll, setDisableScroll] = useState(false);

  // Example placeholder comments
  const comments: Comment[] = [
    {
      id: 1,
      author: "John Doe",
      text: "This is a top-level comment.",
      createdAt: "1 day ago",
      replies: [
        {
          id: 2,
          author: "Jane Smith",
          text: "This is a reply to the top-level comment.",
          createdAt: "23 hours ago",
          replies: [],
          userVoteLevel: null,
          isTopLevel: false,
        },
      ],
      userVoteLevel: 1,
      isTopLevel: true,
    },
  ];

  const handleCommentsClick = () => {
    setShowComments((prevState) => !prevState);
  };

  const handleArrowClick = () => {
    setShowComments((prevState) => !prevState);
  };

  const handleDisableScroll = (disable: boolean) => setDisableScroll(disable);

  return (
    <>
      <div className="fixed top-15 left-1/2 mt-[12px] transform -translate-x-1/2 z-[50]">
        <TopPill onCommentsClick={handleCommentsClick} commentsOpen={showComments} />
      </div>
      <div className="fixed top-1/2 right-0 z-[50] bg-black rounded-l-full rounded-r-none flex justify-center items-center w-16 h-16">
        <CommentsButton onClick={handleCommentsClick} isOpen={showComments} />
      </div>
      {showComments && <ArrowButton isOpen={showComments} onClick={handleArrowClick} />}

      {showComments && (
        <div
          className="fixed top-0 right-0 h-full w-[27%] bg-white shadow-lg z-[100] transition-transform transform translate-x-0 overflow-y-auto border-4 border-gray-300 rounded-lg"
        >
          <div className="h-full">
            <Threads
              comments={comments}
              email="you@example.com"
              isExpanded={expandComments}
              disableScroll={disableScroll}
              onDisableScroll={handleDisableScroll}
            />
          </div>
        </div>
      )}
    </>
  );
}
