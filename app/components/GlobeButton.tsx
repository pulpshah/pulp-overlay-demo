import Image from "next/image";

export default function GlobeButton({
  onClick,
  isActive,
}: {
  onClick: () => void;
  isActive: boolean;
}) {
  return (
    <div className="w-[24px] h-[24px]">
      <button onClick={onClick}>
        <Image
          src={isActive ? "/icons/globe-filled-icon.svg" : "/icons/globe-icon.svg"}
          alt="Globe"
          width={24}
          height={24}
        />
      </button>
    </div>
  );
}
