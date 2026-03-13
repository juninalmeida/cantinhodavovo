import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { SvgSprite } from '@client/shared/icons'
import { AnimatedBackground, BrandFooter, BrandHeader } from '@client/widgets/layout'
import { PublicRouteEffects } from '@client/app/routes/PublicRouteEffects'
import { RouteFallback } from './RouteFallback'

export function AppLayout() {
  return (
    <div className="relative isolate min-h-screen overflow-x-hidden text-cafe">
      <SvgSprite />
      <AnimatedBackground />
      <PublicRouteEffects />
      <BrandHeader />
      <main className="relative z-10 min-h-[calc(100vh-200px)] pt-24">
        <Suspense fallback={<RouteFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <BrandFooter />
    </div>
  )
}
