import React from 'react';
import { AboutSection } from '../components/AboutSection';
import { HowToRegisterSection } from '../components/HowToRegisterSection';

export const AboutPage: React.FC = () => {
  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <AboutSection />
      <HowToRegisterSection />
    </div>
  );
};
