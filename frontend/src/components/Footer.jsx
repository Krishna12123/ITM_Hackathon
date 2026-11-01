import React from 'react';
import { Compass, Mail, MapPin, Phone, Heart, Globe, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#38291F] text-[#FFF8EF] border-t border-[#E7C9A5]/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 mb-12">
          
          {/* Brand & Mission Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F36B21] flex items-center justify-center text-white shadow-md">
                <Compass className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="font-display font-black text-2xl text-white tracking-tight">
                  Yaatra<span className="text-[#F36B21]">Saathi</span>
                </span>
                <span className="block text-[10px] tracking-widest uppercase font-semibold text-[#E7C9A5]">
                  Community-Powered Tourism
                </span>
              </div>
            </div>
            <p className="text-sm text-[#F2E4D2] leading-relaxed max-w-sm">
              Discover authentic Indian heritage, connect with passionate local community guides, and craft unforgettable journeys beyond the ordinary tourist trails.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-[#FFF8EF]/10 hover:bg-[#F36B21] text-[#FFF8EF] hover:text-white flex items-center justify-center transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="w-9 h-9 rounded-full bg-[#FFF8EF]/10 hover:bg-[#F36B21] text-[#FFF8EF] hover:text-white flex items-center justify-center transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-[#FFF8EF]/10 hover:bg-[#F36B21] text-[#FFF8EF] hover:text-white flex items-center justify-center transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.808C10.595 0 9 1.583 9 4.615V8z"/></svg>
              </a>
              <a
                href="https://yaatrasaathi.org"
                target="_blank"
                rel="noreferrer"
                aria-label="Website"
                className="w-9 h-9 rounded-full bg-[#FFF8EF]/10 hover:bg-[#F36B21] text-[#FFF8EF] hover:text-white flex items-center justify-center transition-all duration-200"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm tracking-wider uppercase text-[#E7C9A5]">
              Explore
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#F2E4D2]/90">
              <li>
                <a href="#popular-destinations" className="hover:text-[#F36B21] transition-colors flex items-center gap-1">
                  <span>Popular Destinations</span>
                </a>
              </li>
              <li>
                <a href="#local-experiences" className="hover:text-[#F36B21] transition-colors flex items-center gap-1">
                  <span>Local Experiences</span>
                </a>
              </li>
              <li>
                <a href="/place-details" className="hover:text-[#F36B21] transition-colors">
                  <span>Place Details & Maps</span>
                </a>
              </li>
              <li>
                <a href="/planner" className="hover:text-[#F36B21] transition-colors">
                  <span>AI Trip Planner</span>
                </a>
              </li>
              <li>
                <a href="/route-budget" className="hover:text-[#F36B21] transition-colors">
                  <span>Route & Budget Ledger</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Community & Stories */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm tracking-wider uppercase text-[#E7C9A5]">
              Community
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#F2E4D2]/90">
              <li>
                <a href="/contribute" className="hover:text-[#F36B21] transition-colors flex items-center gap-1">
                  <span>Share a Hidden Gem</span>
                  <ArrowUpRight className="w-3 h-3 text-[#F36B21]" />
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[#F36B21] transition-colors">
                  <span>How YaatraSaathi Works</span>
                </a>
              </li>
              <li>
                <a href="#community-gems" className="hover:text-[#F36B21] transition-colors">
                  <span>Verified Rover Reviews</span>
                </a>
              </li>
              <li>
                <a href="/profile" className="hover:text-[#F36B21] transition-colors">
                  <span>Explorer Profile & Badges</span>
                </a>
              </li>
              <li>
                <a href="/profile" className="hover:text-[#F36B21] transition-colors">
                  <span>Local Hosts Network</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm tracking-wider uppercase text-[#E7C9A5]">
              Contact
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#F2E4D2]/90">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#F36B21] shrink-0" />
                <span>New Delhi & Bundelkhand, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#F36B21] shrink-0" />
                <a href="mailto:hello@yaatrasaathi.org" className="hover:text-[#F36B21] transition-colors">
                  hello@yaatrasaathi.org
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#F36B21] shrink-0" />
                <span>+91 1800 200 4882 (Toll Free)</span>
              </li>
              <li className="pt-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF8EF]/10 text-[11px] font-semibold text-[#E7C9A5]">
                  <Heart className="w-3 h-3 text-[#F36B21] fill-[#F36B21]" />
                  <span>Made for Indian Wanderers</span>
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal Strip */}
        <div className="pt-8 border-t border-[#FFF8EF]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F2E4D2]/70">
          <p>© 2026 YaatraSaathi. All rights reserved. Community-Powered Tourism.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-[#F36B21] transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-[#F36B21] transition-colors">Terms of Service</a>
            <a href="#guidelines" className="hover:text-[#F36B21] transition-colors">Community Guidelines</a>
            <a href="#safety" className="hover:text-[#F36B21] transition-colors">Travel Safety</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
