import Image from "next/image";

export default function TopPill() {
  return (
    <div className="top-pill bg-[#2E2E2E]/80 flex flex-row items-center justify-between rounded-[16px] px-[10px] gap-[20px] max-w-[132px] w-full h-[32px]">
      <div className="w-[24px] h-[24px]">
        <button>
          <Image
            src={"/icons/comment-icon.svg"}
            alt="Comments"
            width={24}
            height={24}
          />
        </button>
      </div>
      <div className="w-[24px] h-[24px]">
        <button>
          <Image src="/icons/ai-icon.svg" alt="AI" width={24} height={24} />
        </button>
      </div>
      <div className="w-[24px] h-[24px]">
        <button>
          <Image src="/icons/globe-icon.svg" alt="References" width={24} height={24} />
        </button>
      </div>
    </div>
  );
}
