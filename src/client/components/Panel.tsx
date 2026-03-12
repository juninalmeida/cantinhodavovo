import type { PropsWithChildren } from 'react'
import { cn } from '../utils/cn'

export function Panel({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <section className={cn('panel', className)}>{children}</section>
}
