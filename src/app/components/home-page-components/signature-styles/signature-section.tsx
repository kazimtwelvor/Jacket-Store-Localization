

"use client"

import Link from "next/link"
import { FaArrowRight, FaChevronDown, FaChevronUp } from "react-icons/fa"
import React, { useState } from "react"
import { Card } from "@/src/app/ui/card"
import { avertaBlack, avertaBold } from "@/src/lib/fonts"

const TruncatedText = ({ text, limit, className, onToggle }: { text: string; limit: number; className?: string; onToggle?: (expanded: boolean) => void }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const isLongText = text.length > limit;

    const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const newExpanded = !isExpanded;
        setIsExpanded(newExpanded);
        onToggle?.(newExpanded);
    };

    return (
        <div className={className}>
            <div className="md:hidden">
                {isLongText && (
                    <button onClick={handleToggle} className="flex items-center justify-center w-full mb-2 text-white hover:text-white/80 transition-colors">
                        {isExpanded ? <FaChevronUp className="w-4 h-4" /> : <FaChevronDown className="w-4 h-4" />}
                    </button>
                )}
                {isExpanded && <p className="text-white/90 leading-relaxed text-sm">{text}</p>}
            </div>

            <p className="hidden md:inline text-white/90 leading-relaxed">
                {text}
            </p>
        </div>
    );
};

export default function SignatureStylesSection() {
    const [menDropdownOpen, setMenDropdownOpen] = useState(false);
    const [womenDropdownOpen, setWomenDropdownOpen] = useState(false);
    const menDesc = "Crafted for the modern warrior, each jacket embodies strength, style and sophistication with premium leather that ages beautifully with every adventure.";
    const womenDesc = "Elegance redefined. From boardroom power moves to weekend adventures, our women's collection celebrates confidence with every curve and contour.";
    const characterLimit = 70;

    return (
        <section className="pt-10 pb-8 bg-white relative">
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 left-10 w-32 h-32 bg-[#2b2b2b] rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#2b2b2b] rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>



            <div className="flex w-full -mx-0">
                <div className="flex-1">
                    <Link href="/collections/male" className="block">
                        <Card className="group hover:shadow-xl border-0 shadow-none overflow-hidden relative h-[360px] md:h-[500px] lg:h-[700px] rounded-none m-0">
                            <div className="relative h-full bg-[#151B1B] overflow-hidden rounded-none">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
                                {menDropdownOpen && <div className="absolute inset-0 bg-black/80 z-[15] md:hidden" />}
                                <div className="absolute inset-0 flex items-start justify-center">
                                    <img
                                        src="https://jacket.us.com/uploads/2025/Untitled_design__10_.png"
                                        alt="Men's Leather Jacket"
                                        className="w-full h-full object-cover object-[5%] md:object-[5%] lg:object-[5%] group-hover:scale-110 transition-transform duration-500 block"
                                    />
                                </div>
                                <div
                                    className="absolute inset-0 flex items-end justify-center pb-6 md:items-end md:justify-center md:pb-6 lg:justify-end lg:pb-24 z-[25]"
                                >
                                    <div className="max-w-md text-center md:text-center md:max-w-md lg:max-w-md px-2 md:px-2 lg:pr-20">
                                        <div>
                                            <h2 className={`text-xl md:text-3xl lg:text-7xl font-bold text-white mb-3 leading-tight ${avertaBlack.className}`}>
                                                MEN'S<br />LEATHER<br />JACKET
                                            </h2>
                                        </div>
                                        <TruncatedText
                                            text={menDesc}
                                            limit={characterLimit}
                                            className="mt-2 text-sm md:text-sm lg:text-base text-center"
                                            onToggle={setMenDropdownOpen}
                                        />
                                        <div className="mt-6 text-center">
                                            <div className="group/button cursor-pointer inline-flex items-center bg-[#2b2b2b] border-b border border- text-white font-bold py-1 px-3 md:py-1 md:px-3 lg:py-2 lg:px-6 hover:bg-[#2b2b2b] transition-colors duration-300">
                                                <span className={`text-center md:text-center lg:text-left ${avertaBold.className}`}>Shop Mens</span>
                                                <FaArrowRight className="hidden lg:block ml-2 opacity-0 group-hover/button:opacity-100 transition-all duration-400 transform group-hover/button:translate-x-1" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Link>
                </div>

                <div className="flex-1">
                    <Link href="/collections/female" className="block">
                        <Card className="group hover:shadow-xl border-0 shadow-none overflow-hidden relative h-[360px] md:h-[500px] lg:h-[700px] rounded-none m-0">
                            <div className="relative h-full bg-[#151B1B] overflow-hidden rounded-none">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
                                {womenDropdownOpen && <div className="absolute inset-0 bg-black/80 z-[15] md:hidden" />}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <img
                                        src={useImageForView("https://jacket.us.com/uploads/2025/uadYfG.webp", "/images/tablet-image.jpg")}
                                        alt="Women's Leather Jacket"
                                        className="w-full h-full object-cover object-[100%] md:object-[100%] lg:object-[100%] group-hover:scale-110 transition-transform duration-500 block"
                                    />
                                </div>
                                <div
                                    className="absolute inset-0 flex items-end justify-center pb-6 md:items-end md:justify-center md:pb-6 lg:justify-start lg:pb-24 z-[25]"
                                >
                                    <div className="max-w-md text-center md:text-center md:max-w-md lg:max-w-md px-2 md:px-2 lg:pl-20">
                                        <div>
                                            <h2 className={`text-xl md:text-3xl lg:text-7xl font-bold text-white mb-3 leading-tight ${avertaBlack.className}`}>
                                                WOMEN'S<br />LEATHER<br />JACKET
                                            </h2>
                                        </div>
                                        <TruncatedText
                                            text={womenDesc}
                                            limit={characterLimit}
                                            className="mt-2 text-sm md:text-sm lg:text-base text-center"
                                            onToggle={setWomenDropdownOpen}
                                        />
                                        <div className="mt-6 text-center">
                                            <div className={`group/button cursor-pointer inline-flex items-center bg-[#2b2b2b] border-b border border- text-white font-bold py-1 px-3 md:py-1 md:px-3 lg:py-2 lg:px-6 hover:bg-[#2b2b2b] transition-colors duration-300 ${avertaBold.className}`}>
                                                <span>Shop Womens</span>
                                                <FaArrowRight className="hidden lg:block ml-2 opacity-0 group-hover/button:opacity-100 transition-all duration-400 transform group-hover/button:translate-x-1" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Link>
                </div>
            </div>
        </section>
    );
}

function useImageForView(desktopImage: string, tabletImage: string): string {
    if (typeof window !== "undefined") {
        const screenWidth = window.innerWidth;
        return screenWidth >= 768 && screenWidth <= 1024 ? tabletImage : desktopImage;
    }
    return desktopImage;
}

