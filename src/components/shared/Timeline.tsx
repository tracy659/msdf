import { StatusUpdate } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { Check, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface TimelineProps {
  statusHistory: StatusUpdate[];
}

const statusIcons = {
  new: Clock,
  under_review: AlertCircle,
  approved: Check,
  rejected: AlertCircle,
  completed: CheckCircle2,
};

const statusColors = {
  new: 'bg-info',
  under_review: 'bg-warning',
  approved: 'bg-success',
  rejected: 'bg-destructive',
  completed: 'bg-primary',
};

export function Timeline({ statusHistory }: TimelineProps) {
  const { t, language, isRTL } = useLanguage();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd MMM yyyy - HH:mm', { locale: language === 'ar' ? ar : enUS });
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      new: t('statusNew'),
      under_review: t('statusUnderReview'),
      approved: t('statusApproved'),
      rejected: t('statusRejected'),
      completed: t('statusCompleted'),
    };
    return labels[status] || status;
  };

  return (
    <div className="relative">
      {statusHistory.map((item, index) => {
        const Icon = statusIcons[item.status] || Clock;
        const isLast = index === statusHistory.length - 1;

        return (
          <div key={index} className={`flex gap-4 ${!isLast ? 'pb-6' : ''}`}>
            {/* Timeline line and dot */}
            <div className="relative flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full ${statusColors[item.status]} flex items-center justify-center z-10`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              {!isLast && (
                <div className="w-0.5 bg-border flex-1 my-2" />
              )}
            </div>

            {/* Content */}
            <div className={`flex-1 pt-1 ${!isLast ? 'pb-4' : ''}`}>
              <h4 className="font-semibold text-foreground">
                {getStatusLabel(item.status)}
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                {formatDate(item.timestamp)}
              </p>
              {item.note && (
                <p className="text-sm text-foreground mt-2 bg-muted rounded-lg p-3">
                  {item.note}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
