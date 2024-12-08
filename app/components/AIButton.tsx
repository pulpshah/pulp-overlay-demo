import Image from "next/image";

export default function AIButton({
  onClick,
  isActive,
}: {
  onClick: () => void;
  isActive: boolean;
}) {
  return (
    <div className="w-[24px] h-[24px]">
      <button onClick={onClick}>
      <img
        src={isActive ? "/icons/ai-filled-icon.svg" : "/icons/ai-icon.svg"}
        alt="AI"
        width={24}
        height={24}
        style={{ width: "24px", height: "24px" }}
        onError={(e) => console.error("Failed to load AI icon. Current src:", e.target.src)}
      />
      </button>
    </div>
  );
}
