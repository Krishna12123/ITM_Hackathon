import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest shadow-[0_-1px_8px_rgba(0,0,0,0.02)] mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-on-primary">
                <span className="material-symbols-outlined text-[18px]">terrain</span>
              </div>
              <span className="font-headline-sm text-headline-sm text-primary font-bold">TerraVenture</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Intelligent expedition architecture, route mapping, and budgetary analysis for global explorers.
            </p>
          </div>
          <div>
            <h4 className="font-label-lg text-label-lg text-on-surface mb-3">Navigation</h4>
            <ul className="space-y-2 font-body-sm text-body-sm text-on-surface-variant">
              <li><a className="hover:text-on-surface transition-colors" href="#">Expeditions</a></li>
              <li><a className="hover:text-on-surface transition-colors" href="#">Interactive Map</a></li>
              <li><a className="hover:text-on-surface transition-colors" href="#">Budget Analytics</a></li>
              <li><a className="hover:text-on-surface transition-colors" href="#">Packing Checklists</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-label-lg text-label-lg text-on-surface mb-3">Platform</h4>
            <ul className="space-y-2 font-body-sm text-body-sm text-on-surface-variant">
              <li><a className="hover:text-on-surface transition-colors" href="#">Community Guides</a></li>
              <li><a className="hover:text-on-surface transition-colors" href="#">Offline Sync</a></li>
              <li><a className="hover:text-on-surface transition-colors" href="#">API Integration</a></li>
              <li><a className="hover:text-on-surface transition-colors" href="#">Safety Dispatches</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-label-lg text-label-lg text-on-surface mb-3">Compliance</h4>
            <ul className="space-y-2 font-body-sm text-body-sm text-on-surface-variant">
              <li><a className="hover:text-on-surface transition-colors" href="#">Terms of Service</a></li>
              <li><a className="hover:text-on-surface transition-colors" href="#">Privacy Framework</a></li>
              <li><a className="hover:text-on-surface transition-colors" href="#">Security Protocols</a></li>
              <li><a className="hover:text-on-surface transition-colors" href="#">Support Center</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-body-sm text-body-sm text-on-surface-variant border-t border-surface-container-high/40">
          <p>© 2025 TerraVenture Technologies. All rights reserved.</p>
          <div className="flex items-center gap-6 font-label-md text-label-md">
            <a className="hover:text-on-surface transition-colors" href="#">Privacy</a>
            <a className="hover:text-on-surface transition-colors" href="#">Security</a>
            <a className="hover:text-on-surface transition-colors" href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
