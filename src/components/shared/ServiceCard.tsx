import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface ServiceCardProps {
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: LucideIcon;
  language: 'ar' | 'en';
  onClick?: () => void;
}

export function ServiceCard({
  nameAr,
  nameEn,
  descriptionAr,
  descriptionEn,
  icon: Icon,
  language,
  onClick,
}: ServiceCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="service-card group cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-smooth">
          <Icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-smooth" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-foreground mb-1">
            {language === 'ar' ? nameAr : nameEn}
          </h3>
          <p className="text-muted-foreground text-sm">
            {language === 'ar' ? descriptionAr : descriptionEn}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
