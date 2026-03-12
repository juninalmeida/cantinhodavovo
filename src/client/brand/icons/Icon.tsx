import type { SVGProps } from 'react'
import { cn } from '../../utils/cn'

interface IconProps extends SVGProps<SVGSVGElement> {
  name: string
  size?: number
}

export function Icon({ name, className, size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} className={cn(className)} {...props}>
      <use href={`#${name}`} />
    </svg>
  )
}
