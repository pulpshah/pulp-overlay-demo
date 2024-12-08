"use client";

import React, { useState } from "react";
import Image from "next/image";

type ReplyType = {
  id: number;
  author: string;
  text: string;
  createdAt: string;
};

type SelfCommentProps = {
  id: number;
  author: string;
  text: string;
  createdAt: string;
  email: string;
  isExpanded: boolean;
  initialReplies?: ReplyType[];
};

export default function SelfComment({
  id,
  author,
  text,
  createdAt,
  email,
  isExpanded,
  initialReplies = [],
}: SelfCommentProps) {
  const [replies, setReplies] = useState(initialReplies);
  const [reactions, setReactions] = useState<{ [key: string]: number }>({});
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(false);

  const emojiList = ["👍", "👎", "❤️", "😂", "😢", "🤓", "🙉"];

  const handleReplySubmit = () => {
    if (!replyText.trim()) return;

    const newReply = {
      id: Date.now(),
      author: "You",
      text: replyText,
      createdAt: new Date().toISOString(),
    };

    setReplies((prev) => [...prev, newReply]);
    setReplyText("");
    setIsReplying(false);
    setShowReplies(true);
  };

  const handleReaction = (emoji: string) => {
    setReactions((prev) => {
      const currentCount = prev[emoji] || 0;
      return { ...prev, [emoji]: currentCount + 1 };
    });
  };

  const handleReactionClick = (emoji: string) => {
    setReactions((prev) => {
      const currentCount = prev[emoji] || 0;
      if (currentCount > 0) {
        const updatedReactions = { ...prev, [emoji]: currentCount - 1 };
        if (updatedReactions[emoji] === 0) {
          delete updatedReactions[emoji];
        }
        return updatedReactions;
      }
      return prev;
    });
  };

  return (
    <div className="mb-4">
      <div className="flex items-start gap-3">
        {/* Main Comment Box */}
        <div className="flex-1">
          <div className="bg-[#2E2E2E] rounded-xl p-4 border border-white/10">
            {/* Author and Actions */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-medium">{author}</span>
              <span className="text-gray-400 text-sm">
                {new Date(createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Comment Text */}
            <p className="text-white mb-3">{text}</p>

            {/* Reactions */}
            {Object.entries(reactions).length > 0 && (
              <div className="flex gap-2 mb-2">
                {Object.entries(reactions).map(([emoji, count]) => (
                  <button
                    key={emoji}
                    onClick={() => handleReactionClick(emoji)}
                    className="flex items-center px-2 py-1 text-white bg-black/50 rounded-md shadow-sm"
                  >
                    {emoji} {count}
                  </button>
                ))}
              </div>
            )}

            {/* Reply Button */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="text-blue-500 hover:underline"
              >
                {showReplies ? "Hide Replies" : `${replies.length} Replies`}
              </button>
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="text-blue-500 hover:underline"
              >
                {isReplying ? "Cancel" : "Reply"}
              </button>
            </div>
          </div>
        </div>

        {/* Profile Picture */}
        <div className="flex-shrink-0">
          <Image
            src="/profiles/profile_pic_1.png"
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
      </div>

      {/* Reply Input */}
      {isReplying && (
        <div className="mt-2 ml-12">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write your reply..."
            className="w-full bg-[#2E2E2E] p-3 text-white border border-white/10 rounded-lg"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleReplySubmit}
              className="px-4 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {/* Replies Section */}
      {showReplies && replies.length > 0 && (
        <div className="mt-4 ml-8 space-y-4">
          {replies.map((reply) => (
            <div key={reply.id} className="flex items-start gap-3">
              <Image
                src="/profiles/profile_pic_1.png"
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full"
              />
              <div className="flex-1 bg-[#2E2E2E] rounded-xl p-3 border border-white/10">
                <p className="text-sm text-white font-medium">{reply.author}</p>
                <p className="text-sm text-white mt-1">{reply.text}</p>
                <span className="text-xs text-gray-400">
                  {new Date(reply.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
