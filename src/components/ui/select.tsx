import React from 'react';
import { Form } from 'react-bootstrap';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<React.ComponentProps<typeof Form.Select>, 'onChange'> {
  options: SelectOption[];
  label?: string;
  onChange?: (value: string) => void;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, label, onChange, size, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      onChange && onChange(event.target.value);
    };

    return (
      <Form.Group className="mb-3">
        {label && <Form.Label>{label}</Form.Label>}
        <Form.Select
          className={className}
          onChange={handleChange}
          ref={ref}
          size={size}
          {...props}
        >
          {options.map((option:any) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
    );
  }
);

Select.displayName = 'Select';