"use client"

import SizeGuideClient from "./size-guide-client"
import SizeGuideCTA from "./size-guide-cta"

export default function SizeGuideClientPage() {
  return (
    <>
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

      <div className="js-only">
        <SizeGuideClient />
      </div>

      <noscript>
        <SizeGuideCTA />
      </noscript>

      <style jsx global>{`
        html {
          class: no-js;
        }
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
