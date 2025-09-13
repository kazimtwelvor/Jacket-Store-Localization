"use client"

import React from 'react';

import {
  Us, Gb, Ca, Au, De, Fr, Es, It, Nl, Se, Be, Ch, At, Dk, No, Fi, Ie, Pt, Gr, Pl, Cz, Hu, Sk, Si, Hr, Bg, Ro, Ee, Lv, Lt, Lu, Mt, Cy, Jp, Kr, Sg, Hk, Nz, Za, Br, Mx, Ar, Cl, Co, Pe, In, Cn, Th, My, Ph, Id, Vn, Ae, Sa, Il, Tr, Eg, Ma, Ng, Ke, Gh, Ru, Ua
} from 'react-flags-select';

const flagComponents: Record<string, React.ComponentType<any>> = {
  US: Us,
  GB: Gb,
  CA: Ca,
  AU: Au,
  DE: De,
  FR: Fr,
  ES: Es,
  IT: It,
  NL: Nl,
  SE: Se,
  BE: Be,
  CH: Ch,
  AT: At,
  DK: Dk,
  NO: No,
  FI: Fi,
  IE: Ie,
  PT: Pt,
  GR: Gr,
  PL: Pl,
  CZ: Cz,
  HU: Hu,
  SK: Sk,
  SI: Si,
  HR: Hr,
  BG: Bg,
  RO: Ro,
  EE: Ee,
  LV: Lv,
  LT: Lt,
  LU: Lu,
  MT: Mt,
  CY: Cy,
  JP: Jp,
  KR: Kr,
  SG: Sg,
  HK: Hk,
  NZ: Nz,
  ZA: Za,
  BR: Br,
  MX: Mx,
  AR: Ar,
  CL: Cl,
  CO: Co,
  PE: Pe,
  IN: In,
  CN: Cn,
  TH: Th,
  MY: My,
  PH: Ph,
  ID: Id,
  VN: Vn,
  AE: Ae,
  SA: Sa,
  IL: Il,
  TR: Tr,
  EG: Eg,
  MA: Ma,
  NG: Ng,
  KE: Ke,
  GH: Gh,
  RU: Ru,
  UA: Ua,
};

interface CountryFlagProps {
  countryCode: string;
  size?: number;
  className?: string;
}

export default function CountryFlag({ countryCode, size = 32, className = "" }: CountryFlagProps) {
  const FlagComponent = flagComponents[countryCode];
  
  if (!FlagComponent) {
    return (
      <div 
        className={`bg-gray-600 rounded flex items-center justify-center text-white text-xs font-bold ${className}`}
        style={{ width: size, height: size * 0.75 }}
      >
        {countryCode}
      </div>
    );
  }
  
  return (
    <div className={className} style={{ width: size, height: size * 0.75 }}>
      <FlagComponent />
    </div>
  );
}
