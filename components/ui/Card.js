'use client';

export function Card({ className = '', children, ...props }) {
  return (
    <div
      className={`card-base transition-smooth ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ className = '', children, ...props }) {
  return (
    <h2
      className={`mb-4 text-lg font-bold text-white md:text-xl ${className}`}
      {...props}
    >
      {children}
    </h2>
  );
}

export function CardDescription({ className = '', children, ...props }) {
  return (
    <p
      className={`text-sm text-gray-400 ${className}`}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({ className = '', children, ...props }) {
  return (
    <div className={`space-y-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children, ...props }) {
  return (
    <div className={`border-b border-white/5 pb-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className = '', children, ...props }) {
  return (
    <div className={`border-t border-white/5 pt-4 ${className}`} {...props}>
      {children}
    </div>
  );
}
