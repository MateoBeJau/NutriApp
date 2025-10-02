'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'default', size = 'md', className = '', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50';
    
    const variants = {
      default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500'
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    };

    const variantStyles = variants[variant];
    const sizeStyles = sizes[size];
    const allClasses = [baseStyles, variantStyles, sizeStyles, className].filter(Boolean).join(' ');

    return (
      <button
        ref={ref}
        className={allClasses}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;