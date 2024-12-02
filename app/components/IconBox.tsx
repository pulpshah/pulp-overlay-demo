import Image from "next/image";

interface IconBoxProps {
  src: string;
  alt?: string;
  className?: string; // Custom styles
  onClick?: () => void; // Click handler
}

export default function IconBox({ src, alt = "icon", className, onClick }: IconBoxProps) {
  return (
    <div
      className={`p-[4px] items-center justify-center flex-col rounded-[8px] bg-black/60 ${className}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onClick?.()}
    >
      <Image src={src} alt={alt} width={19} height={19} />
    </div>
  );
}
