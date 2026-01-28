import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  HandHeart, Users, HeartHandshake, Accessibility, Home, Siren,
  ArrowRight, ArrowLeft, Sparkles, ChevronRight
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockServices } from '@/lib/mockData';
import { Button } from '@/components/ui/button';

const iconMap: Record<string, any> = {
  HandHeart,
  Users,
  HeartHandshake,
  Accessibility,
  Home,
  Siren,
};

const gradients = [
  'from-rose-500/20 via-primary/10 to-orange-500/20',
  'from-amber-500/20 via-accent/10 to-yellow-500/20',
  'from-emerald-500/20 via-green-500/10 to-teal-500/20',
  'from-blue-500/20 via-indigo-500/10 to-purple-500/20',
  'from-pink-500/20 via-rose-500/10 to-red-500/20',
  'from-cyan-500/20 via-sky-500/10 to-blue-500/20',
];

const iconColors = [
  'bg-gradient-to-br from-primary to-rose-600',
  'bg-gradient-to-br from-accent to-amber-600',
  'bg-gradient-to-br from-emerald-500 to-teal-600',
  'bg-gradient-to-br from-blue-500 to-indigo-600',
  'bg-gradient-to-br from-pink-500 to-rose-600',
  'bg-gradient-to-br from-cyan-500 to-blue-600',
];

function ServiceCard({ 
  service, 
  index, 
  language, 
  onClick 
}: { 
  service: typeof mockServices[0]; 
  index: number; 
  language: string;
  onClick: () => void;
}) {
  const Icon = iconMap[service.icon] || HandHeart;
  const isRTL = language === 'ar';
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative"
    >
      {/* Card glow effect */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradients[index % gradients.length]} rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500`} />
      
      <div className="relative h-full bg-card rounded-2xl border border-border overflow-hidden transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-2xl">
        {/* Top gradient bar */}
        <div className={`h-1.5 bg-gradient-to-r ${gradients[index % gradients.length]}`} />
        
        {/* Background pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity">
          <Icon className="w-full h-full" />
        </div>

        <div className="p-6 relative">
          {/* Icon */}
          <motion.div
            whileHover={{ rotate: 5, scale: 1.1 }}
            className={`w-14 h-14 rounded-xl ${iconColors[index % iconColors.length]} flex items-center justify-center shadow-lg mb-4`}
          >
            <Icon className="w-7 h-7 text-white" />
          </motion.div>

          {/* Title */}
          <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
            {language === 'ar' ? service.nameAr : service.nameEn}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
            {language === 'ar' ? service.descriptionAr : service.descriptionEn}
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              <span>{language === 'ar' ? 'متاح' : 'Available'}</span>
            </div>
            <div>
              {language === 'ar' 
                ? `${service.estimatedDays} يوم تقريباً` 
                : `~${service.estimatedDays} days`}
            </div>
          </div>

          {/* CTA Button */}
          <motion.button
            onClick={onClick}
            whileHover={{ x: isRTL ? -5 : 5 }}
            className="flex items-center gap-2 text-primary font-medium text-sm group/btn"
          >
            <span>{language === 'ar' ? 'تقديم طلب' : 'Apply Now'}</span>
            <Arrow className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1" />
          </motion.button>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>
    </motion.div>
  );
}

export function ServicesSection() {
  const { t, language, isRTL } = useLanguage();
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-background" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            {language === 'ar' ? 'خدماتنا المتميزة' : 'Our Premium Services'}
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            {t('availableServices')}
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'اكتشف مجموعة واسعة من الخدمات الحكومية المصممة لتلبية احتياجاتك' 
              : 'Discover a wide range of government services designed to meet your needs'}
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {mockServices.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              language={language}
              onClick={() => navigate('/assistant')}
            />
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/assistant')}
            className="group px-8 py-6 text-lg border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
          >
            {language === 'ar' ? 'استكشف جميع الخدمات' : 'Explore All Services'}
            <ChevronRight className="w-5 h-5 ms-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
