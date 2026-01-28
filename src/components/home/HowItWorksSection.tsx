import { motion } from 'framer-motion';
import { MessageSquare, Upload, CreditCard, Search, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const steps = [
  {
    step: '١',
    stepEn: '1',
    titleAr: 'تحدث مع المساعد الذكي',
    titleEn: 'Chat with AI Assistant',
    descAr: 'أخبرنا عن احتياجاتك وسيساعدك المساعد الذكي في اختيار الخدمة المناسبة',
    descEn: 'Tell us about your needs and the AI assistant will help you choose the right service',
    icon: MessageSquare,
    color: 'from-primary/20 to-primary/5',
  },
  {
    step: '٢',
    stepEn: '2',
    titleAr: 'أرفق المستندات',
    titleEn: 'Attach Documents',
    descAr: 'قم بتحميل المستندات المطلوبة وسيتم مراجعتها تلقائياً',
    descEn: 'Upload the required documents and they will be reviewed automatically',
    icon: Upload,
    color: 'from-accent/20 to-accent/5',
  },
  {
    step: '٣',
    stepEn: '3',
    titleAr: 'ادفع الرسوم',
    titleEn: 'Pay Fees',
    descAr: 'قم بدفع رسوم الخدمة إن وجدت عبر بوابة الدفع الإلكترونية الآمنة',
    descEn: 'Pay the service fees if required through the secure payment gateway',
    icon: CreditCard,
    color: 'from-success/20 to-success/5',
  },
  {
    step: '٤',
    stepEn: '4',
    titleAr: 'تابع طلبك',
    titleEn: 'Track Your Request',
    descAr: 'احصل على رقم طلب وتابع حالته من خلال لوحة التحكم',
    descEn: 'Get a case number and track its status through the dashboard',
    icon: Search,
    color: 'from-info/20 to-info/5',
  },
];

// Floating AI particles component
function AIParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * -100 - 50],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut",
          }}
          style={{
            left: `${15 + i * 15}%`,
            top: `${60 + Math.random() * 20}%`,
          }}
        >
          <Sparkles className="w-4 h-4 text-primary/40" />
        </motion.div>
      ))}
    </div>
  );
}

// Animated connection line between steps
function ConnectionLine({ index, isRTL }: { index: number; isRTL: boolean }) {
  if (index === steps.length - 1) return null;
  
  return (
    <div className="hidden lg:block absolute top-1/2 -translate-y-1/2 w-full h-0.5">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary/30 via-primary to-primary/30"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.2 + 0.5, duration: 0.5 }}
        style={{ 
          transformOrigin: isRTL ? 'right' : 'left',
          left: isRTL ? '-100%' : '100%',
          width: '100%'
        }}
      />
      <motion.div
        className="absolute w-2 h-2 bg-primary rounded-full"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.2 + 0.8 }}
        style={{ 
          top: '50%',
          transform: 'translateY(-50%)',
          [isRTL ? 'left' : 'right']: '-4px'
        }}
      />
    </div>
  );
}

export function HowItWorksSection() {
  const { language, isRTL } = useLanguage();

  return (
    <section className="py-16 md:py-24 bg-muted/50 relative overflow-hidden">
      {/* AI-themed background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.1)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.1)_0%,transparent_50%)]" />
      </div>

      <AIParticles />

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          {/* AI Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
            {language === 'ar' ? 'مدعوم بالذكاء الاصطناعي' : 'Powered by AI'}
          </motion.div>

          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
            {language === 'ar' ? 'كيف تعمل البوابة؟' : 'How It Works'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'أربع خطوات بسيطة للحصول على خدماتك بسهولة وسرعة'
              : 'Four simple steps to get your services easily and quickly'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 max-w-6xl mx-auto">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <ConnectionLine index={index} isRTL={isRTL} />
                
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative bg-card rounded-2xl p-6 shadow-lg border border-border hover:border-primary/30 transition-colors h-full"
                >
                  {/* Gradient background */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.color} opacity-50`} />
                  
                  {/* Content */}
                  <div className="relative">
                    {/* Step number & Icon */}
                    <div className="flex items-center justify-between mb-4">
                      <motion.div
                        whileHover={{ rotate: 10 }}
                        className="w-14 h-14 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
                      >
                        <Icon className="w-6 h-6" />
                      </motion.div>
                      <span className="text-4xl font-bold text-primary/20">
                        {language === 'ar' ? item.step : item.stepEn}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-lg mb-3 text-foreground">
                      {language === 'ar' ? item.titleAr : item.titleEn}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {language === 'ar' ? item.descAr : item.descEn}
                    </p>

                    {/* AI indicator for first step */}
                    {index === 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 flex items-center gap-2 text-xs text-primary"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Sparkles className="w-3 h-3" />
                        </motion.div>
                        {language === 'ar' ? 'ذكاء اصطناعي متقدم' : 'Advanced AI'}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom AI Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-card border border-border shadow-sm">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {language === 'ar' 
                ? 'المساعد الذكي جاهز لمساعدتك'
                : 'AI Assistant ready to help you'}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
