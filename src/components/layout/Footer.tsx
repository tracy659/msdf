import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, BadgeCheck, Headphones, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import msdfLogo from '@/assets/msdf-logo.png';

export function Footer() {
  const { t, language } = useLanguage();

  const quickLinks = [
    { labelAr: 'الرئيسية', labelEn: 'Home', href: '/' },
    { labelAr: 'الخدمات', labelEn: 'Services', href: '/assistant' },
    { labelAr: 'طلباتي', labelEn: 'My Requests', href: '/dashboard' },
    { labelAr: 'تسجيل الدخول', labelEn: 'Login', href: '/login' },
  ];

  const externalLinks = [
    { labelAr: 'البوابة الحكومية', labelEn: 'Hukoomi Portal', href: 'https://hukoomi.gov.qa' },
    { labelAr: 'الموقع الرسمي', labelEn: 'Official Website', href: 'https://msdf.gov.qa' },
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* Trust Badges Section */}
      <div className="bg-gradient-to-r from-primary via-primary to-primary/95 text-primary-foreground">
        <div className="container mx-auto px-4 py-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { icon: Shield, labelAr: 'بوابة آمنة', labelEn: 'Secure Portal', descAr: 'حماية متقدمة للبيانات', descEn: 'Advanced data protection' },
              { icon: BadgeCheck, labelAr: 'خدمة رسمية', labelEn: 'Official Service', descAr: 'خدمة حكومية معتمدة', descEn: 'Certified government service' },
              { icon: Headphones, labelAr: 'دعم على مدار الساعة', labelEn: '24/7 Support', descAr: 'فريق دعم متخصص', descEn: 'Dedicated support team' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{language === 'ar' ? item.labelAr : item.labelEn}</h3>
                  <p className="text-sm text-primary-foreground/70">
                    {language === 'ar' ? item.descAr : item.descEn}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Logo & About */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 mb-6"
              >
                <img 
                  src={msdfLogo} 
                  alt="MSDF Qatar" 
                  className="h-12 w-auto brightness-0 invert"
                />
              </motion.div>
              <p className="text-slate-400 mb-6 max-w-md leading-relaxed">
                {language === 'ar' 
                  ? 'بوابة الخدمات الإلكترونية لوزارة التنمية الاجتماعية والأسرة - دولة قطر. نسعى لتقديم خدمات متميزة وسهلة الوصول لجميع المواطنين.'
                  : 'E-Services Portal for the Ministry of Social Development and Family - State of Qatar. We strive to provide excellent and accessible services to all citizens.'}
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <a href="tel:+97444545454" className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors">
                  <Phone className="w-4 h-4" />
                  <span dir="ltr">+974 4454 5454</span>
                </a>
                <a href="mailto:info@msdf.gov.qa" className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors">
                  <Mail className="w-4 h-4" />
                  <span>info@msdf.gov.qa</span>
                </a>
                <div className="flex items-center gap-3 text-slate-400">
                  <MapPin className="w-4 h-4" />
                  <span>{language === 'ar' ? 'الدوحة، قطر' : 'Doha, Qatar'}</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-lg mb-4">
                {language === 'ar' ? 'روابط سريعة' : 'Quick Links'}
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-slate-400 hover:text-white hover:translate-x-1 transition-all inline-block"
                    >
                      {language === 'ar' ? link.labelAr : link.labelEn}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* External Links */}
            <div>
              <h3 className="font-bold text-lg mb-4">
                {language === 'ar' ? 'روابط خارجية' : 'External Links'}
              </h3>
              <ul className="space-y-3">
                {externalLinks.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                    >
                      <span>{language === 'ar' ? link.labelAr : link.labelEn}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                ))}
              </ul>

              {/* Legal Links */}
              <div className="mt-6 pt-6 border-t border-slate-800">
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                      {t('privacyPolicy')}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                      {t('termsOfService')}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="border-t border-slate-800">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
              <p>{t('footerText')}</p>
              <p>
                {language === 'ar' 
                  ? `© ${new Date().getFullYear()} وزارة التنمية الاجتماعية والأسرة. جميع الحقوق محفوظة.`
                  : `© ${new Date().getFullYear()} Ministry of Social Development and Family. All rights reserved.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
