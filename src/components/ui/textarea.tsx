import React from 'react';
import { Form } from 'react-bootstrap';
 
export interface TextareaProps extends Omit<React.ComponentProps<typeof Form.Control>, 'onChange'> {
  label?: string;
  onChange?: (value: string) => void;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <Form.Group className="mb-3">
        {label && <Form.Label>{label}</Form.Label>}
        <Form.Control
          as="textarea"
          className={className}
          ref={ref}
          {...props}
        />
      </Form.Group>
    );
  }
);

Textarea.displayName = 'Textarea';