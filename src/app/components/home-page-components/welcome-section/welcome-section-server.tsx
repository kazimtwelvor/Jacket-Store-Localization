import WelcomeAccordionSectionClient from "./welcome-section-client"

export const revalidate = 7200 

const welcomeContentData = {
    title: "WELCOME TO FINEYST",
    subtitle: "Your Destination for Timeless, Custom, and Everyday Leather Jackets",
    description: "At FINEYST, we craft authentic leather jackets with real cowhide, lambskin, goatskin, and suede—built for durability, comfort, and lasting style.",
    readMoreText: "Explore biker, bomber, custom, cropped, and trench styles in men's, women's, and unisex fits. Choose from classic black, deep brown, or standout shades like burgundy, olive, and distressed finishes.",
    closingText: "Each jacket is hand-finished to wear well and age even better.",
    sectionTitle: "THINGS TO KNOW ABOUT LEATHER JACKETS",
    accordions: [
        {
            key: "expensive",
            title: "WHY ARE LEATHER JACKETS EXPENSIVE?",
            content: {
                intro: "A real leather jacket is more than a garment — it's an investment. Here's why prices vary:",
                points: [
                    {
                        title: "High-Quality Leather:",
                        description: "Full-grain cowhide and lambskin are premium hides that last for years, age beautifully, and offer unmatched strength and texture."
                    },
                    {
                        title: "Skilled Craftsmanship:",
                        description: "Our jackets are handmade by expert artisans using traditional methods — precision cutting, reinforced stitching, and detailed finishing."
                    },
                    {
                        title: "Time - Intensive Production:",
                        description: "From ethical sourcing to tanning to construction, each jacket takes time — especially for complex or custom pieces."
                    },
                    {
                        title: "Hardware & Lining Quality:",
                        description: "We only use durable zippers, breathable linings, and solid inner structure — because longevity matters."
                    },
                    {
                        title: "Brand Transparency:",
                        description: "Unlike fast fashion, we don't cut corners — FINEYST prioritizes real leather, ethical labor, and transparent practices."
                    }
                ]
            }
        },
        {
            key: "bestLeather",
            title: "WHAT'S THE BEST LEATHER FOR JACKETS?",
            content: {
                intro: "It depends on the fit, feel, and use case:",
                points: [
                    {
                        title: "Cowhide:",
                        description: "Rugged, weather-resistant, ideal for biker and bomber jackets."
                    },
                    {
                        title: "Lambskin:",
                        description: "Lightweight, buttery soft, best for fitted and everyday wear."
                    },
                    {
                        title: "Goatskin:",
                        description: "Durable and flexible with a pebbled finish."
                    },
                    {
                        title: "Suede:",
                        description: "Smooth, matte texture for streetwear or vintage aesthetics."
                    },
                    {
                        title: "Distressed & Washed Leathers:",
                        description: "Adds character and edge with worn-in looks."
                    }
                ],
                closing: "At FINEYST, we use only full-grain hides — no PU or bonded leather. Every jacket is made to endure."
            }
        },
        {
            key: "rightStyle",
            title: "WHAT STYLE IS RIGHT FOR YOU?",
            content: {
                intro: "Our range covers both classic and modern looks:",
                points: [
                    {
                        title: "Biker Jackets:",
                        description: "Asymmetrical zip, attitude built in"
                    },
                    {
                        title: "Bomber Jackets:",
                        description: "Heritage aviation meets everyday comfort"
                    },
                    {
                        title: "Racer Jackets:",
                        description: "Minimalist, close-cut, versatile"
                    },
                    {
                        title: "Trench & Long Coats:",
                        description: "Full-coverage, structured silhouettes"
                    },
                    {
                        title: "Cropped, Oversized, Custom:",
                        description: "Fashion-forward and personalized"
                    }
                ],
                closing: "We make jackets for men, women, and all body types — because leather belongs to everyone."
            }
        },
        {
            key: "colors",
            title: "POPULAR COLORS WE OFFER",
            content: {
                points: [
                    {
                        title: "Black:",
                        description: "Always in, forever iconic"
                    },
                    {
                        title: "Brown & Tan:",
                        description: "Timeless and rugged"
                    },
                    {
                        title: "Burgundy / Red / Olive:",
                        description: "For standout personalities"
                    },
                    {
                        title: "Two-tone / Distressed:",
                        description: "Vintage feel, modern attitude"
                    }
                ]
            }
        }
    ]
}

export default function WelcomeAccordionSectionServer() {
    return (
        <WelcomeAccordionSectionClient contentData={welcomeContentData} />
    )
}
