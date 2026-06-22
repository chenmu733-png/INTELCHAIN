export function Card({ className = '', children }) {
  return (
    <div className={`glass rounded-2xl p-4 ${className}`}>{children}</div>
  );
}

export function CardTitle({ children, action }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h3 className="text-sm font-semibold text-gray-200">{children}</h3>
      {action}
    </div>
  );
}
