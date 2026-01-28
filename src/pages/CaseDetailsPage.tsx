import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, FileText, Download, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCases } from '@/contexts/CaseContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Timeline } from '@/components/shared/Timeline';
import { ChatBubble } from '@/components/chat/ChatBubble';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function CaseDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, language, isRTL } = useLanguage();
  const { getCaseById } = useCases();

  const caseItem = id ? getCaseById(id) : undefined;
  const showChat = searchParams.get('chat') === 'true';

  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd MMM yyyy', { locale: language === 'ar' ? ar : enUS });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (!caseItem) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {language === 'ar' ? 'الطلب غير موجود' : 'Case Not Found'}
          </h1>
          <Button onClick={() => navigate('/dashboard')}>
            <BackArrow className="w-4 h-4 me-2" />
            {t('back')}
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-6"
          >
            <BackArrow className="w-4 h-4 me-2" />
            {language === 'ar' ? 'العودة للطلبات' : 'Back to Requests'}
          </Button>

          {/* Case Header Card */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <h1 className="text-xl md:text-2xl font-bold text-foreground">
                      {caseItem.caseNumber}
                    </h1>
                    <StatusBadge status={caseItem.status} />
                  </div>
                  <p className="text-muted-foreground">
                    {caseItem.serviceNameAr}
                  </p>
                </div>

                <div className="text-start md:text-end">
                  <p className="text-2xl font-bold text-primary">
                    {caseItem.estimatedPrice} {t('qar')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('submissionDate')}: {formatDate(caseItem.submissionDate)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue={showChat ? 'chat' : 'timeline'} className="space-y-6">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="timeline">
                {t('statusTimeline')}
              </TabsTrigger>
              <TabsTrigger value="chat">
                {t('chatHistory')}
              </TabsTrigger>
              <TabsTrigger value="documents">
                {t('uploadedDocuments')}
              </TabsTrigger>
            </TabsList>

            {/* Timeline Tab */}
            <TabsContent value="timeline">
              <Card>
                <CardHeader>
                  <CardTitle>{t('statusTimeline')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Timeline statusHistory={caseItem.statusHistory} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Chat History Tab */}
            <TabsContent value="chat">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{t('chatHistory')}</CardTitle>
                  <Button
                    size="sm"
                    onClick={() => navigate('/assistant')}
                  >
                    <MessageSquare className="w-4 h-4 me-2" />
                    {t('continueConversation')}
                  </Button>
                </CardHeader>
                <CardContent>
                  {caseItem.messages.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      {language === 'ar' 
                        ? 'لا توجد رسائل بعد'
                        : 'No messages yet'}
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[500px] overflow-y-auto">
                      {caseItem.messages.map((message) => (
                        <ChatBubble
                          key={message.id}
                          role={message.role}
                          content={message.content}
                          timestamp={message.timestamp}
                          attachments={message.attachments}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>{t('uploadedDocuments')}</CardTitle>
                </CardHeader>
                <CardContent>
                  {caseItem.documents.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      {language === 'ar' 
                        ? 'لا توجد مستندات مرفوعة'
                        : 'No documents uploaded'}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {caseItem.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center gap-4 p-4 bg-muted rounded-lg"
                        >
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">
                              {doc.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatFileSize(doc.size)} • {formatDate(doc.uploadedAt)}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </MainLayout>
  );
}
