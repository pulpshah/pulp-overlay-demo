import Image from "next/image";

export default function ArrowButton({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) {
    return (
        <div
        className={`fixed top-1/2 right-[27%] transform -translate-y-1/2 z-[60] cursor-pointer  ${
          isOpen ? "" : ""
        } transition-transform`}
        onClick={onClick}
      >
        <button className="bg-black rounded-l-full rounded-r-none flex justify-center items-center w-16 h-16 shadow-md">
          <Image
            src="/icons/double-chevron-right-icon.svg"
            alt=""
            width={24}
            height={24}
          />
        </button>
      </div>
    );
  }
  