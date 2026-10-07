import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { PrizesAndPerksSection } from '../components/PrizesAndPerksSection';
import { EventsSection } from '../components/EventsSection';
import { HowToRegisterSection } from '../components/HowToRegisterSection';
import { AboutSection } from '../components/AboutSection';
import { ContactSection } from '../components/ContactSection';

export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <PrizesAndPerksSection />
      <EventsSection />
      <HowToRegisterSection />
      <AboutSection />
      <ContactSection />
    </div>
  );
};
