import { CaseStatus } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface StatusBadgeProps {
  status: CaseStatus;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig: Record<CaseStatus, { labelKey: string; className: string }> = {
  new: { labelKey: 'statusNew', className: 'status-new' },
  under_review: { labelKey: 'statusUnderReview', className: 'status-review' },
  approved: { labelKey: 'statusApproved', className: 'status-approved' },
  rejected: { labelKey: 'statusRejected', className: 'status-rejected' },
  completed: { labelKey: 'statusCompleted', className: 'status-completed' },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const { t } = useLanguage();
  const config = statusConfig[status];

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  return (
    <span className={`${config.className} ${sizeClasses[size]} inline-flex items-center rounded-full font-medium`}>
      {t(config.labelKey as any)}
    </span>
  );
}
