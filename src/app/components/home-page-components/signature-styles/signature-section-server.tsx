import { unstable_cache } from "next/cache";
import SignatureSectionClient from "@/src/app/components/home-page-components/signature-styles/signature-section-client";

export const revalidate = 3600; 

interface SignatureData {
  men: {
    title: string;
    description: string;
    imageUrl: string;
    href: string;
  };
  women: {
    title: string;
    description: string;
    imageUrl: string;
    tabletImageUrl: string;
    href: string;
  };
}

const getCachedSignatureData = unstable_cache(
  async (): Promise<SignatureData> => {
    return {
      men: {
        title: "MEN'S LEATHER JACKET",
        description: "Crafted for the modern warrior, each jacket embodies strength, style and sophistication with premium leather that ages beautifully with every adventure.",
        imageUrl: "/uploads/2025/Untitled_design__10_.png",
        href: "/us/collections/leather-bomber-jacket-mens",
      },
      women: {
        title: "WOMEN'S LEATHER JACKET",
        description: "Elegance redefined. From boardroom power moves to weekend adventures, our women's collection celebrates confidence with every curve and contour.",
        imageUrl: "https://www.fineystjackets.com/uploads/2025/uadYfG.webp",
        tabletImageUrl: "/images/tablet-image.jpg",
        href: "/us/collections/womens-leather-bomber-jackets",
      },
    };
  },
  ['signature-styles'],
  { revalidate: 3600, tags: ['signature-styles'] }
);

export default async function SignatureSectionServer() {
  const signatureData = await getCachedSignatureData();

  return <SignatureSectionClient signatureData={signatureData} />;
}
