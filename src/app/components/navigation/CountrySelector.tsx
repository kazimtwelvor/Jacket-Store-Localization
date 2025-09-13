"use client"

import React, { useState, useRef, useEffect } from 'react';
import { useCountry, countries } from '../../contexts/CountryContext';
import { ChevronDown, Globe, Search } from 'lucide-react';
import CountryFlag from '../flags/CountryFlag';

export default function CountrySelector() {
  const { selectedCountry, setSelectedCountry } = useCountry();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCountryChange = (country: any) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearchTerm('');
  };

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayCountry = selectedCountry || countries.find(c => c.code === 'US');

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-white/10 rounded-md transition-colors border border-transparent hover:border-white/20"
      >
        {displayCountry ? (
          <>
            <CountryFlag countryCode={displayCountry.code} size={16} />
            <span className="hidden sm:inline font-medium">{displayCountry.name}</span>
            <span className="sm:hidden font-medium">{displayCountry.code}</span>
          </>
        ) : (
          <>
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">Country</span>
          </>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-[#000000] border border-gray-800 rounded-lg shadow-2xl min-w-[280px] z-50 backdrop-blur-sm">
          <div className="p-3 border-b border-gray-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-white/5 border border-gray-700 rounded-md text-white text-sm placeholder-gray-400 focus:ring-2 focus:ring-white/20 focus:border-white/30 outline-none"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600">
            {filteredCountries.length > 0 ? (
              <div className="p-2">
                {filteredCountries.slice(0, 10).map((country) => (
                  <button
                    key={country.code}
                    onClick={() => handleCountryChange(country)}
                    className={`w-full flex items-center gap-3 p-3 text-left hover:bg-white/5 rounded-md transition-all duration-200 border border-transparent hover:border-white/10 group ${
                      selectedCountry?.code === country.code ? 'bg-white/10 border-white/20' : ''
                    }`}
                  >
                    <div className="group-hover:scale-110 transition-transform">
                      <CountryFlag countryCode={country.code} size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white text-sm group-hover:text-gray-100">
                        {country.name}
                      </div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">
                        {country.code}
                      </div>
                    </div>
                    {selectedCountry?.code === country.code && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </button>
                ))}
                {filteredCountries.length > 10 && (
                  <div className="p-3 text-center text-gray-400 text-xs">
                    Showing first 10 results. Keep typing to narrow down.
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 text-center">
                <Globe className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                <p className="text-gray-400 text-sm">No countries found</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}