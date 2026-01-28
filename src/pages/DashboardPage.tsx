import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Eye, MessageSquare, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCases } from '@/contexts/CaseContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CaseStatus } from '@/lib/types';

export default function DashboardPage() {
  const { t, language, isRTL } = useLanguage();
  const { cases } = useCases();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CaseStatus | 'all'>('all');

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const matchesSearch =
        c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.serviceNameAr.includes(searchQuery);
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [cases, searchQuery, statusFilter]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd MMM yyyy', { locale: language === 'ar' ? ar : enUS });
  };

  const statusOptions: { value: CaseStatus | 'all'; label: string }[] = [
    { value: 'all', label: t('allStatuses') },
    { value: 'new', label: t('statusNew') },
    { value: 'under_review', label: t('statusUnderReview') },
    { value: 'approved', label: t('statusApproved') },
    { value: 'rejected', label: t('statusRejected') },
    { value: 'completed', label: t('statusCompleted') },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {t('myRequests')}
              </h1>
              <p className="text-muted-foreground mt-1">
                {language === 'ar' 
                  ? `لديك ${filteredCases.length} طلب`
                  : `You have ${filteredCases.length} request(s)`}
              </p>
            </div>
            
            <Button
              onClick={() => navigate('/assistant')}
              className="w-full md:w-auto"
            >
              <MessageSquare className="w-4 h-4 me-2" />
              {language === 'ar' ? 'طلب جديد' : 'New Request'}
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-5 h-5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'ar' ? 'بحث برقم الطلب...' : 'Search by case number...'}
                className="ps-10"
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
            
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as CaseStatus | 'all')}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="w-4 h-4 me-2" />
                <SelectValue placeholder={t('filterByStatus')} />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Cases List */}
          {filteredCases.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {t('noRequests')}
              </h3>
              <p className="text-muted-foreground mb-6">
                {language === 'ar' 
                  ? 'لم يتم العثور على طلبات. ابدأ طلبًا جديدًا الآن!'
                  : 'No requests found. Start a new request now!'}
              </p>
              <Button onClick={() => navigate('/assistant')}>
                {language === 'ar' ? 'ابدأ طلب جديد' : 'Start New Request'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCases.map((caseItem, index) => (
                <motion.div
                  key={caseItem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="gov-card p-4 md:p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Case Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-bold text-foreground">
                          {caseItem.caseNumber}
                        </h3>
                        <StatusBadge status={caseItem.status} size="sm" />
                      </div>
                      
                      <p className="text-muted-foreground">
                        {caseItem.serviceNameAr}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(caseItem.submissionDate)}
                        </span>
                        <span className="font-medium text-primary">
                          {caseItem.estimatedPrice} {t('qar')}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/case/${caseItem.id}`)}
                      >
                        <Eye className="w-4 h-4 me-1" />
                        {t('viewDetails')}
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => navigate(`/case/${caseItem.id}?chat=true`)}
                      >
                        <MessageSquare className="w-4 h-4 me-1" />
                        {t('continueChat')}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </MainLayout>
  );
}
