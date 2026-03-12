import { Outlet } from 'react-router-dom'
import { AnimatedBackground } from '../brand/AnimatedBackground'
import { BrandFooter } from '../brand/BrandFooter'
import { BrandHeader } from '../brand/BrandHeader'
import { SvgSprite } from '../brand/icons/SvgSprite'
import { PublicRouteEffects } from '../components/PublicRouteEffects'

export function AppLayout() {
  return (
    <div className="relative isolate min-h-screen overflow-x-hidden text-cafe">
      <SvgSprite />
      <AnimatedBackground />
      <PublicRouteEffects />
      <BrandHeader />
      <main className="relative z-10 min-h-[calc(100vh-200px)] pt-24">
        <Outlet />
      </main>
      <BrandFooter />
    </div>
  )
}
