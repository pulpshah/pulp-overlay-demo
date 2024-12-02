import Image from "next/image";

export default function LoadingScreen() {
  return (
    <div className="w-full flex items-center justify-center gap-[10px]">
      <div className="bg-gradient-to-r from-white to-[#E7E7E7] w-[34px] h-[34px] rounded-full">
        <Image
          src="/profiles/loading-pfp.svg"
          alt="loading"
          width={34}
          height={34}
        />
      </div>
      <div className="w-full h-auto flex flex-col items-center gap-[6px] px-[10px] py-[10px] rounded-[10px] border border-[#7D7B7C] border-[0.5px] bg-white shadow-loading">
        <div className="w-full flex flex-row justify-between">
          <div className="flex flex-row py-[2px] rounded-[10px] bg-[#E7E7E7]">
            <p className="opacity-0">Username</p>
            <Image
              src={`/icons/loading-icon.svg`}
              alt="Loading"
              width={24}
              height={24}
              className="opacity-0"
            />
          </div>
          <div className="py-[2px] rounded-[10px] bg-[#E7E7E7]">
            <p className="opacity-0">reply</p>
          </div>
        </div>
        <div className="flex flex-col gap-[6px] w-full">
          <div className="bg-[#E7E7E7] rounded-[10px] w-full h-[19px]">
            <p className="opacity-0">.</p>
          </div>
          <div className="bg-[#E7E7E7] rounded-[10px] w-4/5 h-[19px]">
            <p className="opacity-0">.</p>
          </div>
          <div className="bg-[#E7E7E7] rounded-[10px] w-9/10 h-[19px]">
            <p className="opacity-0">.</p>
          </div>
        </div>
        <div className="flex flex-row w-full justify-between">
          <div className="flex flex-row gap-[8px] justify-start">
            <div className="bg-[#E7E7E7] rounded-[10px] w-auto h-[20px] justify-center">
              <p className="opacity-0">2 👍</p>
            </div>
            <div className="bg-[#E7E7E7] rounded-[10px] w-auto h-[20px] justify-center">
              <p className="opacity-0">10 🤓</p>
            </div>
          </div>
          <div className="flex flex-row gap-[6px] justify-start">
            <div className="bg-[#E7E7E7] rounded-[10px] w-auto h-[20px] justify-center">
              <p className="opacity-0">102 replies</p>
            </div>
            <div className="bg-[#E7E7E7] rounded-[10px] w-auto h-[20px] justify-center">
              <p className="opacity-0">...............</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
