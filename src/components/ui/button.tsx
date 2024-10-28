import React from 'react'
import { Button as BootstrapButton, ButtonProps as BootstrapButtonProps } from 'react-bootstrap'

export interface ButtonProps extends Omit<BootstrapButtonProps, 'size'> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link' | 'outline-primary' | 'outline-secondary' | 'outline-success' | 'outline-danger' | 'outline-warning' | 'outline-info' | 'outline-light' | 'outline-dark';
  size?: 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size, children, ...props }, ref) => {
 
    const sizeClass = size === 'icon' ? 'p-2' : undefined;
    const buttonSize = size === 'icon' ? undefined : size;

    return (
      <BootstrapButton
        ref={ref}
        variant={variant}
        size={buttonSize}
        className={`${sizeClass} ${className || ''}`}
        {...props}
      >
        {children}
      </BootstrapButton>
    )
  }
)

Button.displayName = 'Button'