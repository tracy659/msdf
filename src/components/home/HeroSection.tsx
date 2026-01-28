import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, FileText, ArrowLeft, ArrowRight, Sparkles, Bot, Zap, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

// Animated floating orbs
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large gradient orbs */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)',
          top: '-20%',
          right: '-10%',
        }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsl(var(--accent) / 0.12) 0%, transparent 70%)',
          bottom: '-30%',
          left: '-10%',
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -20, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Small floating particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary/30"
          style={{
            left: `${10 + (i * 7)}%`,
            top: `${20 + (i % 4) * 20}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + (i % 3),
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Animated AI brain/network visualization
function AIVisualization() {
  const nodes = [
    { x: 50, y: 30 },
    { x: 70, y: 50 },
    { x: 30, y: 50 },
    { x: 50, y: 70 },
    { x: 85, y: 35 },
    { x: 15, y: 35 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
      <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        {/* Connection lines */}
        {nodes.map((node, i) => 
          nodes.slice(i + 1).map((target, j) => (
            <motion.line
              key={`${i}-${j}`}
              x1={node.x}
              y1={node.y}
              x2={target.x}
              y2={target.y}
              stroke="hsl(var(--primary))"
              strokeWidth="0.15"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: [0, 1, 1, 0],
                opacity: [0, 0.5, 0.5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: (i + j) * 0.5,
                ease: "easeInOut",
              }}
            />
          ))
        )}
        
        {/* Nodes */}
        {nodes.map((node, i) => (
          <motion.circle
            key={i}
            cx={node.x}
            cy={node.y}
            r="1.5"
            fill="hsl(var(--primary))"
            initial={{ scale: 0 }}
            animate={{ 
              scale: [0.8, 1.2, 0.8],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

// Animated typing text effect
function TypewriterText({ text, className }: { text: string; className?: string }) {
  return (
    <motion.span className={className}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03, duration: 0.3 }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Feature badges
function FeatureBadges({ language }: { language: string }) {
  const features = [
    { icon: Bot, labelAr: 'مساعد ذكي', labelEn: 'AI Assistant' },
    { icon: Zap, labelAr: 'سريع وفعال', labelEn: 'Fast & Efficient' },
    { icon: Shield, labelAr: 'آمن وموثوق', labelEn: 'Secure & Trusted' },
  ];

  return (
    <motion.div 
      className="flex flex-wrap justify-center gap-3 mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      {features.map((feature, i) => (
        <motion.div
          key={i}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border/50 text-sm"
          whileHover={{ scale: 1.05, backgroundColor: 'hsl(var(--primary) / 0.1)' }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 + i * 0.1 }}
        >
          <feature.icon className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">
            {language === 'ar' ? feature.labelAr : feature.labelEn}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}

export function HeroSection() {
  const { t, language, isRTL } = useLanguage();
  const navigate = useNavigate();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Animated background elements */}
      <FloatingOrbs />
      <AIVisualization />
      
      {/* Gradient mesh overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(var(--accent)/0.06)_0%,transparent_50%)]" />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Animated AI Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 border border-primary/20 backdrop-blur-sm mb-8"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="relative"
            >
              <Sparkles className="w-5 h-5 text-primary" />
              <motion.div
                className="absolute inset-0"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-5 h-5 text-primary" />
              </motion.div>
            </motion.div>
            <div className="flex items-center gap-2">
              <motion.span
                className="w-2 h-2 rounded-full bg-green-500"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-sm font-medium text-foreground">
                {language === 'ar' ? 'دولة قطر - خدمات حكومية رسمية' : 'State of Qatar - Official Government Services'}
              </span>
            </div>
          </motion.div>

          {/* Main Title with gradient */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                {t('heroTitle')}
              </span>
            </h1>
          </motion.div>

          {/* Subtitle with animation */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            {t('heroSubtitle')}
          </motion.p>

          {/* CTA Buttons with stagger animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div 
              whileHover={{ scale: 1.05, y: -2 }} 
              whileTap={{ scale: 0.98 }}
              className="relative group"
            >
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-xl blur-lg opacity-40 group-hover:opacity-70 transition-opacity" />
              <Button 
                className="relative btn-hero-primary w-full sm:w-auto text-lg px-8 py-6"
                onClick={() => navigate('/assistant')}
              >
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="flex items-center"
                >
                  {t('startService')}
                  <Arrow className="w-5 h-5 ms-2" />
                </motion.span>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button 
                className="btn-hero-secondary w-full sm:w-auto text-lg px-8 py-6"
                onClick={() => navigate('/assistant')}
              >
                <MessageSquare className="w-5 h-5 me-2" />
                {t('talkToAssistant')}
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button 
                className="btn-hero-accent w-full sm:w-auto text-lg px-8 py-6"
                onClick={() => navigate('/dashboard')}
              >
                <FileText className="w-5 h-5 me-2" />
                {t('viewRequests')}
              </Button>
            </motion.div>
          </motion.div>

          {/* Feature badges */}
          <FeatureBadges language={language} />
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent" />
      
      {/* Animated bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
        <motion.svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-16"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <motion.path
            d="M0,60 C300,100 600,20 900,60 C1050,85 1150,70 1200,60 L1200,120 L0,120 Z"
            fill="hsl(var(--muted) / 0.3)"
            animate={{
              d: [
                "M0,60 C300,100 600,20 900,60 C1050,85 1150,70 1200,60 L1200,120 L0,120 Z",
                "M0,70 C300,30 600,90 900,50 C1050,35 1150,60 1200,70 L1200,120 L0,120 Z",
                "M0,60 C300,100 600,20 900,60 C1050,85 1150,70 1200,60 L1200,120 L0,120 Z",
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.svg>
      </div>
    </section>
  );
}
