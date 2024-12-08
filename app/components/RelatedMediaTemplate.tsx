import Image from "next/image";

export default function RelatedMediaTemplates() {
    return (
        <div className="flex flex-col width-full p-[14px] justify-center items-start gap-[7px] rounded-[17.5px] border-[1.75px] border-[#7D7B7C] bg-[#2E2E2E] text-white related-media-template-box-shadow">
            <div className="flex flex-col justify-center items-center gap-[7px]">
                <div className="flex items-start gap-[7px] self-stretch">
                    <div className="flex w-auto justify-center items-center self-stretch">
                        <div className="flex-col w-auto items-start gap-[17.5px] shrink-0">
                            <Image
                                src="/logos/youtube-logo.svg"
                                alt="YouTube"
                                width={17.5}
                                height={12.38}
                            />
                        </div>
                    </div>
                    <div>
                        <p>What is CPI (Consumer Price Index)</p>
                    </div>
                    <div className="flex justify-end items-center gap-[8px]">
                        <Image
                            src="/icons/link-external-icon.svg"
                            alt=""
                            width={19}
                            height={19}
                        />
                    </div>
                </div>
                <div className="flex justify-end items-start gap-[17.5px] self-stretch">
                    <Image
                        src="/samples/example1.png"
                        alt=""
                        width={340}
                        height={175}
                    />
                </div>
            </div>
            <div className="flex justify-between items-start self-stretch">
                {/* Frame 116047119 */}
                <div className="flex flex-col justify-center items-start">
                    <p>Youtube channel</p>
                    <p className="text-white/50">@WIRED</p>
                </div>
                <div className="flex flex-col justify-center items-start">
                    <p>Length</p>
                    <p className="text-white/50">16:35</p>
                </div>
            </div>
        </div>


    //     <div className="flex flex-col width-full p-[14px] justify-center items-start gap-[7px] rounded-[17.5px] border-[1.75px] border-[#7D7B7C] bg-[#EAEAEA] text-black related-media-template-box-shadow">
    //     <div className="flex flex-col justify-center items-center gap-[7px]">
    //         <div className="flex items-start gap-[7px] self-stretch">
    //             <div className="flex w-auto justify-center items-center self-stretch">
    //                 <div className="flex-col w-auto items-start gap-[17.5px] shrink-0">
    //                     <Image
    //                         src="/logos/twitch-logo.svg"
    //                         alt="Twitch"
    //                         width={17.5}
    //                         height={12.38}
    //                     />
    //                 </div>
    //             </div>
    //             <div className="flex items-center text-[14px] font-bold">
    //                 <p className="twitch-live">LIVE </p>
    //                 <span> • Lets Inflation!</span>
    //             </div>
    //             <div className="flex justify-end items-center gap-[8px]">
    //                 <Image
    //                     src="/icons/link-external-icon.svg"
    //                     alt=""
    //                     width={19}
    //                     height={19}
    //                 />
    //             </div>
    //         </div>
    //         <div className="flex justify-end items-start gap-[17.5px] self-stretch">
    //             <Image
    //                 src="/samples/example2.png"
    //                 alt=""
    //                 width={340}
    //                 height={175}
    //             />
    //         </div>
    //     </div>
    //     <div className="flex justify-between items-start self-stretch">
    //         {/* Frame 116047119 */}
    //         <div className="flex flex-col justify-center items-start">
    //             <p>Twitch Stream</p>
    //             <p className="text-black/50">@AdilKhan</p>
    //         </div>
    //         <div className="flex flex-col justify-center items-start">
    //             <p>Length</p>
    //             <p className="text-black/50">42:35</p>
    //         </div>
    //     </div>
    // </div>
    )
}