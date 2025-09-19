import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className = '', children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={`block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none transition-colors ${className}`}
      {...props}
    >
      {children}
    </select>
  );
});
Select.displayName = 'Select';

export default Select;
