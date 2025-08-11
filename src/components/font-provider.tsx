'use client';

import { avertaBold, avertaDefault } from "@/src/lib/fonts";

export function FontProvider({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${avertaDefault.variable} ${avertaBold.variable}`}>
      {children}
    </div>
  );
}
