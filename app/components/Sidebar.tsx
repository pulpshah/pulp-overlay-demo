import Image from "next/image";

export function Sidebar({
    isOpen,
    toggleSidebar,
    children,
  }: {
    isOpen: boolean;
    toggleSidebar: () => void;
    children: React.ReactNode;
  }) {
    return (
      <>
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className={`fixed top-1/2 transform -translate-y-1/2 z-50 bg-black rounded-l-full rounded-r-none flex justify-center items-center w-16 h-16 hover:bg-gray-800 transition-all duration-300 ${
            isOpen ? "translate-x-[-440px]" : "translate-x-0"
          }`}
          style={{
            right: isOpen ? "calc(400px)" : "0rem", // Adjusted to account for sidebar width
          }}
        >
          <Image
            src={
              isOpen
                ? "/icons/chevron-right-double-icon.svg"
                : "/icons/filled-comment-icon.svg"
            }
            width={28}
            height={28}
            alt={isOpen ? "Close Sidebar" : "Open Sidebar"}
          />
        </button>
  
        {/* Sidebar */}
        <div
          className={`fixed top-0 right-0 h-full w-[400px] bg-gray-200 shadow-lg z-40 transition-transform duration-300 backdrop-blur-[24px] ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-4">{children}</div>
        </div>
      </>
    );
  }
  