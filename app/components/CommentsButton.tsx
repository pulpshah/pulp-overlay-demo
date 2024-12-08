import Image from "next/image";

export default function CommentsButton({
  onClick,
  isOpen,
}: {
  onClick: () => void;
  isOpen: boolean;
}) {
  return (
    <>
    <div className="w-[24px] h-[24px]">
      <button onClick={onClick}>
        <Image
            src={isOpen ? "/icons/comments-filled-icon.svg" : "/icons/comments-icon.svg"}
            alt="Comments"
            width={24}
            height={24}
        />
      </button>
      </div>
    </>
  );
}
