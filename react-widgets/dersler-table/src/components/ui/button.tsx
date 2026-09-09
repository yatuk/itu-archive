import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// shadcn/ui'nin button.tsx'inden uyarlandı: yalnızca bu widget'ın kullandığı
// "ghost" varyantı tutuldu (sıralama başlığı butonu), gereksiz varyant
// eklenmedi. Tüm utility sınıfları tailwind.config.js'teki prefix: 'dt-'
// ile eşleşsin diye "dt-" önekiyle yazılmıştır.
const buttonVariants = cva(
  'dt-inline-flex dt-items-center dt-justify-center dt-whitespace-nowrap dt-rounded-md dt-text-sm dt-font-medium dt-transition-colors focus-visible:dt-outline-none focus-visible:dt-ring-2 focus-visible:dt-ring-ring focus-visible:dt-ring-offset-2 disabled:dt-pointer-events-none disabled:dt-opacity-50',
  {
    variants: {
      variant: {
        default: 'dt-bg-primary dt-text-primary-foreground hover:dt-bg-primary/90',
        ghost: 'hover:dt-bg-accent hover:dt-text-accent-foreground',
      },
      size: {
        default: 'dt-h-10 dt-px-4 dt-py-2',
        sm: 'dt-h-9 dt-rounded-md dt-px-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
