import { useState } from 'react';
import { SvgSprite } from './components/icons/SvgSprite';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { AnimatedBackground } from './components/layout/AnimatedBackground';
import { HeroSection } from './features/hero/HeroSection';
import { MenuSection } from './features/menu/MenuSection';
import { CustomizerSection } from './features/order-customizer/CustomizerSection';
import { LoadingScreen } from './components/layout/LoadingScreen';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <SvgSprite />
      <AnimatedBackground />
      
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="relative z-10 pt-20 min-h-[calc(100vh-200px)]">
        {activeTab === 'home' && <HeroSection setActiveTab={setActiveTab} />}
        {activeTab === 'cardapio' && <MenuSection />}
        {activeTab === 'monte-seu-combo' && <CustomizerSection />}
      </main>

      <Footer />
    </>
  );
}

export default App;
