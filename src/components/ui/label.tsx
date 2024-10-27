import React from 'react';
import { Form } from 'react-bootstrap';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor?: string;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, htmlFor, ...props }, ref) => {
    return (
      <Form.Label
        className={className}
        htmlFor={htmlFor}
        ref={ref}
        {...props}
      >
        {children}
      </Form.Label>
    );
  }
);

Label.displayName = 'Label';