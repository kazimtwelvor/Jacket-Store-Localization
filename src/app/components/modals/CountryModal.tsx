"use client"

import React, { useState } from 'react';
import { useCountry, countries } from '../../contexts/CountryContext';
import { X, Search, Globe, MapPin } from 'lucide-react';
import CountryFlag from '../flags/CountryFlag';

export default function CountryModal() {
  const { showCountryModal, setShowCountryModal, setSelectedCountry } = useCountry();
  const [searchTerm, setSearchTerm] = useState('');

  if (!showCountryModal) return null;

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCountrySelect = (country: any) => {
    setSelectedCountry(country);
  };

  const handleModalClose = () => {
    const defaultCountry = countries.find(c => c.code === 'US');
    if (defaultCountry) {
      setSelectedCountry(defaultCountry);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-[#000000] border border-gray-800 rounded-xl max-w-lg w-full max-h-[85vh] overflow-hidden shadow-2xl transform animate-in fade-in-50 zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-full border border-white/20">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Select Your Location</h2>
                  <p className="text-gray-400">Choose your country for localized experience</p>
                </div>
              </div>
              <button
                onClick={handleModalClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors border border-transparent hover:border-white/20"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-white/20 focus:border-white/30 outline-none transition-all"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600">
            {filteredCountries.length > 0 ? (
              <div className="p-2">
                {filteredCountries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => handleCountrySelect(country)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-white/5 rounded-lg transition-all duration-200 text-left border border-transparent hover:border-white/10 group"
                  >
                     <div className="group-hover:scale-110 transition-transform duration-200">
                       <CountryFlag countryCode={country.code} size={32} />
                     </div>
                    <div className="flex-1">
                      <div className="font-semibold text-white group-hover:text-gray-100 transition-colors">
                        {country.name}
                      </div>
                      <div className="text-sm text-gray-400 uppercase tracking-wider">
                        {country.code}
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <Globe className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400 text-lg">No countries found</p>
                <p className="text-gray-500 text-sm mt-2">Try adjusting your search</p>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-800 bg-white/2">
            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Your preference will be saved automatically</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
