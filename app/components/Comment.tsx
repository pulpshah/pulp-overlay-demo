"use client";

import React, { useState } from "react";
import Image from "next/image";

type ReplyType = {
  id: number;
  author: string;
  text: string;
  createdAt: string;
  replies?: ReplyType[];
};

type CommentProps = {
  commentText: string;
  author: string;
  commentIndex: number;
  isExpanded: boolean;
  isMinimized: boolean;
  replies: ReplyType[];
  email: string;
  startingVoteLevel: number | null;
};

export default function Comment({
  commentText,
  author,
  replies = [],
}: CommentProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(false); // Toggle replies

  const handleReplySubmit = () => {
    if (!replyText.trim()) return;

    // Placeholder reply logic
    const newReply = {
      id: Date.now(),
      author: "You",
      text: replyText,
      createdAt: new Date().toISOString(),
    };
    replies.push(newReply); // Simulate backend response
    setReplyText("");
    setIsReplying(false);
    setShowReplies(true); // Automatically show replies after adding
  };

  return (
    <div className="mb-2">
      <div className="flex items-start gap-2">
        {/* Main Comment Box */}
        <div className="flex-1">
          <div className="bg-[#2E2E2E] rounded-xl p-3 border border-white/10">
            {/* Author Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">{author}</span>
              </div>
              <div className="flex items-center gap-3">
                <button className="opacity-100 hover:opacity-100 transition-opacity">
                  <Image
                    src="/icons/reaction-icon.svg"
                    alt="Reaction"
                    width={19}
                    height={19}
                    className="invert brightness-0"
                  />
                </button>
                <button
                  onClick={() => setIsReplying(!isReplying)}
                  className="opacity-60 hover:opacity-100 transition-opacity"
                >
                  <Image
                    src="/icons/reply-icon.svg"
                    alt="Reply"
                    width={19}
                    height={19}
                    className="invert brightness-0"
                  />
                </button>
              </div>
            </div>

            {/* Comment Text */}
            <p className="text-white text-[15px] mb-3">{commentText}</p>

            {/* Footer with Reply Count */}
            <div className="flex items-center justify-end">
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="text-[white] text-sm hover:text-[white] transition-colors"
              >
                {replies.length} {replies.length === 1 ? "reply" : "replies"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Reply */}
      {isReplying && (
        <div className="mt-2 ml-8">
          <div className="bg-[#2E2E2E] rounded-xl p-3 border border-white/10">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your reply..."
              className="w-full bg-transparent text-white border-none outline-none text-sm"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleReplySubmit}
                className="px-4 py-1 bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600 transition-colors"
              >
                Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Replies Section */}
      {showReplies && replies.length > 0 && (
        <div className="ml-4 mt-2 space-y-2">
          {replies.map((reply) => (
            <div key={reply.id} className="flex gap-3">
              <div className="flex-1 bg-[#2E2E2E] rounded-xl p-3 border border-white/10">
                <div className="mb-1">
                  <span className="text-white font-medium">{reply.author}</span>
                </div>
                <p className="text-white text-sm">{reply.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
