import { cn } from '../../lib/utils';

export const Icon = ({ name, className, size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    className={cn('', className)}
    {...props}
  >
    <use href={`#${name}`} />
  </svg>
);