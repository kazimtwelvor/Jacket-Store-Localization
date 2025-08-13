"use client"

import SizeGuideClient from "./size-guide-client"
import  SizeGuideCTANoJS  from "./size-guide-cta"

export default function SizeGuidePageClient() {
  return (
    <>
      <SizeGuideClient />

      <noscript>
        <SizeGuideCTANoJS />
      </noscript>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              document.documentElement.classList.remove('no-js');
              document.documentElement.classList.add('js');
            })();
          `,
        }}
      />

      <style jsx global>{`
        .no-js .js-only {
          display: none;
        }
        html.no-js .no-js-only {
          display: block;
        }
        html.js .no-js-only {
          display: none;
        }
      `}</style>
    </>
  )
}
