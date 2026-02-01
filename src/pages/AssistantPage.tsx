import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { ChatInterface } from "@/components/chat/ChatInterface";

export default function AssistantPage() {
  const { language } = useLanguage();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {language === "ar" ? "المساعد الذكي" : "AI Assistant"}
            </h1>
            <p className="text-muted-foreground">
              {language === "ar"
                ? "تحدث مع المساعد الذكي لبدء طلب جديد أو الاستفسار عن خدماتنا"
                : "Chat with the AI assistant to start a new request or inquire about our services"}
            </p>
          </div>

          {/* Chat Interface */}
          <div className="h-[calc(100vh-300px)] min-h-[500px]">
            <ChatInterface />
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
