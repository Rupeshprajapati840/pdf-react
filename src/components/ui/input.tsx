import React from 'react';
import { Form } from 'react-bootstrap';

export interface InputProps extends Omit<React.ComponentProps<typeof Form.Control>, 'onChange'> {
  label?: string;
  onChange?: (value: string) => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e.target.value); // Pass the value instead of the event
      }
    };

    return (
      <Form.Group className="mb-3">
        {label && <Form.Label>{label}</Form.Label>}
        <Form.Control
          className={className}
          ref={ref}
          onChange={handleChange} // Use the custom handler
          {...props}
        />
      </Form.Group>
    );
  }
);

Input.displayName = 'Input';