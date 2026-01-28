import { motion } from 'framer-motion';
import { HandHeart, Users, HeartHandshake, Accessibility, Home, Siren } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { mockServices } from '@/lib/mockData';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { HeroSection } from '@/components/home/HeroSection';
import { ServicesSection } from '@/components/home/ServicesSection';

export default function HomePage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <HeroSection />

      {/* Services Section */}
      <ServicesSection />

      {/* How It Works Section */}
      <HowItWorksSection />
    </MainLayout>
  );
}
