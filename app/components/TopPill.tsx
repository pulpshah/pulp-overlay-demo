import AIButton from "./AIButton";
import GlobeButton from "./GlobeButton";
import CommentsButton from "./CommentsButton";
import { useState } from "react";

export default function TopPill({
  onCommentsClick,
  commentsOpen,
}: {
  onCommentsClick: () => void;
  commentsOpen: boolean;
}) {
  const [activeIcon, setActiveIcon] = useState<"comments" | "ai" | "globe" | null>(null);

  const handleSetActiveIcon = (icon: "comments" | "ai" | "globe") => {
    setActiveIcon((prev) => {
      const newActive = prev === icon ? null : icon;
      console.log(`Active icon changed: ${newActive}`);
      return newActive;
    });
  };
  

  return (
    <div
      className={`flex flex-col items-start gap-[12px] rounded-[999px] bg-white/20 backdrop-blur-[12px] ${
        activeIcon ? "pill-active" : ""
      }`}
    >
      <div className="flex p-[2px] justify-center items-center gap-[12px]">
        <div className="flex h-[38px] py-[5px] justify-center items-center gap-[24px] rounded-[19.2px] bg-[#0E0E0E]">
          <div className="flex py-[10px] px-[8px] gap-[10px]">
            <div className="flex items-center gap-[24px]">
              <div>
              <CommentsButton
                onClick={() => {
                  onCommentsClick();
                  handleSetActiveIcon("comments");
                }}
                isOpen={activeIcon === "comments"}
              />
              </div>
              <div>
              <AIButton
                onClick={() => handleSetActiveIcon("ai")}
                isActive={activeIcon === "ai"}
              />
              </div>
              <div>
                <GlobeButton
                  onClick={() => handleSetActiveIcon("globe")}
                  isActive={activeIcon === "globe"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
