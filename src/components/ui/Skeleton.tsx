import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
  rounded?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = 'w-full',
  height = 'h-4',
  rounded = 'rounded-lg',
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-gray-200/80 animate-pulse ${width} ${height} ${rounded} ${className}`}
      {...props}
    />
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-[#FAD7A0]/60 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton width="w-1/3" height="h-5" />
        <Skeleton width="w-12" height="h-5" rounded="rounded-full" />
      </div>
      <Skeleton width="w-full" height="h-4" />
      <Skeleton width="w-4/5" height="h-4" />
      <div className="pt-2 flex justify-between">
        <Skeleton width="w-1/4" height="h-6" />
        <Skeleton width="w-1/4" height="h-6" />
      </div>
    </div>
  );
};

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="bg-white rounded-2xl border border-[#FAD7A0]/70 p-4 space-y-4">
      <div className="flex justify-between items-center pb-2 border-b">
        <Skeleton width="w-48" height="h-6" />
        <Skeleton width="w-24" height="h-8" rounded="rounded-xl" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between gap-4 py-2 border-b border-gray-100">
          <Skeleton width="w-1/4" height="h-4" />
          <Skeleton width="w-1/4" height="h-4" />
          <Skeleton width="w-1/6" height="h-4" />
          <Skeleton width="w-12" height="h-6" rounded="rounded-md" />
        </div>
      ))}
    </div>
  );
};
