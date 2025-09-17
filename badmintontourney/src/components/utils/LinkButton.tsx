import Link from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { AnchorHTMLAttributes } from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary:
          'bg-emerald-600 text-white shadow-sm hover:bg-emerald-500 focus-visible:ring-emerald-500',
        secondary:
          'bg-gray-100 text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-200 focus-visible:ring-gray-400',
        ghost:
          'hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-400',
      },
      size: {
        sm: 'h-9 px-3',
        md: 'h-10 px-4 py-2',
        lg: 'h-11 px-8 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface LinkButtonProps
  extends AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof buttonVariants> {
  href: string;
}

export const LinkButton = ({
  className,
  variant,
  size,
  href,
  children,
  ...props
}: LinkButtonProps) => {
  return (
    <Link
      href={href}
      className={buttonVariants({ variant, size, className })}
      {...props}
    >
      {children}
    </Link>
  );
};