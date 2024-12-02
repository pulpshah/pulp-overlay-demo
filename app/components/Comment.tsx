import { useState } from "react";
import IconBox from "./IconBox";
import LoadingScreen from "./CommentLoading";

export default function Comment() {
  // States for managing the comment's stages
  const [state, setState] = useState<"locked" | "voting" | "intermediate" | "loading" | "revealed">("locked");
  const [selectedVote, setSelectedVote] = useState<"agree" | "disagree" | null>(null);

  // Function to handle voting
  const handleVote = (vote: "agree" | "disagree") => {
    setSelectedVote(vote); // Record the vote
    setState("intermediate"); // Transition to intermediate state
    setTimeout(() => setState("loading"), 100); // Transition to loading state after a brief delay
  };

  // Function to go back to the locked state
  const handleBack = () => {
    setState("locked");
    setSelectedVote(null); // Reset the selected vote
  };

  return (
    <div className="w-full h-full flex gap-[10px] items-center relative">
      {state === "loading" ? (
        // Use the LoadingScreen component here
        <LoadingScreen />
      ) : (
        <div className="flex items-center justify-center w-full h-full gap-[12px] px-[12px] py-[12px] rounded-[10px] bg-white border-[#7D7B7C] border-[0.5px]">
          <div className="w-full h-fit">
            <p className="h-auto">
              Arsenal didn’t &lsquo;come back&lsquo;; Chelsea bottled it as usual. Can’t keep
              blaming luck when you can’t hold a lead! 🙄
            </p>
          </div>
          
          {state === "locked" && (
            <button onClick={() => setState("voting")}>
              <IconBox src="/icons/lock-icon.svg" alt="Locked" />
            </button>
          )}

          {state === "voting" && (
            <div className="flex flex-col gap-[10px] items-center">
              <IconBox
                src="/icons/x-circle-icon.svg"
                alt="Disagree"
                className="bg-blur-[6px] drop-shadow-[0_0_8.7px_#FFCDCD] drop-shadow-[0_0_35.2px_rgba(255,255,255,0.14)]"
                onClick={() => handleVote("disagree")}
              />
              <IconBox
                src="/icons/loading-icon.svg"
                alt="Back"
                className="bg-blur-[6px] drop-shadow-[0_0_35.2px_rgba(255,255,255,0.14)]"
                onClick={handleBack}
              />
              <IconBox
                src="/icons/check-circle-icon.svg"
                alt="Agree"
                className="bg-blur-[6px] drop-shadow-[0_0_8.7px_#DAFFCE] drop-shadow-[0_0_35.2px_rgba(255,255,255,0.14)]"
                onClick={() => handleVote("agree")}
              />
            </div>
          )}

          {state === "intermediate" && selectedVote && (
            <div className="flex justify-center items-center w-full">
              {/* Show the selected icon in its container */}
              <div className="flex flex-col gap-[10px] items-center">
                <IconBox
                  src={selectedVote === "agree" ? "/icons/check-circle-icon.svg" : "/icons/x-circle-icon.svg"}
                  alt={selectedVote === "agree" ? "Agree" : "Disagree"}
                  className="bg-blur-[6px] drop-shadow-[0_0_8.7px_#DAFFCE] drop-shadow-[0_0_35.2px_rgba(255,255,255,0.14)]"
                />
              </div>
            </div>
          )}

          {state === "revealed" && (
            <div className="flex items-center justify-center w-full h-full">
              {/* Placeholder content for revealed state */}
              <p className="revealed-placeholder">Revealed content goes here.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
