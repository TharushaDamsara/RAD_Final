
interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  error?: string;
  style?: React.CSSProperties;
}
export function Card({
  title,
  children,
  className = '',
  loading = false,
  error,
  style
}: CardProps) {
  if (loading) {
    return <div className={`glass-card p-6 min-h-[200px] flex items-center justify-center animate-pulse ${className}`}>
      <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
    </div>;
  }
  if (error) {
    return <div className={`glass-card p-6 border-l-4 border-red-500 bg-red-50/50 ${className}`}>
      <p className="text-red-600">{error}</p>
    </div>;
  }
  return <div className={`glass-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${className}`} style={style}>
    {title && <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>}
    {children}
  </div>;
}