import type { ReactNode } from 'react';
import { EmptyState } from '../ui/EmptyState';
import { Spinner } from '../ui/Spinner';

type DataTableProps = {
  children: ReactNode;
  loading?: boolean;
  empty?: boolean;
  emptyIcon?: ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
};

export function DataTable({
  children,
  loading,
  empty,
  emptyIcon,
  emptyTitle = 'No data found',
  emptyDescription,
  emptyAction,
}: DataTableProps) {
  if (loading) {
    return (
      <div className="data-table-loading">
        <Spinner size="md" />
        <span>Loading...</span>
      </div>
    );
  }

  if (empty) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  return (
    <div className="data-table-wrap">
      <table className="data-table">{children}</table>
    </div>
  );
}
