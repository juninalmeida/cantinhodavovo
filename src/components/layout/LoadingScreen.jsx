import { useState, useEffect } from 'react';

const StarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#D9913B" className="inline-block transform -translate-y-1">
    <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z"/>
  </svg>
);

export function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const messages = [
    "Esquentando a chapa...",
    "Caprichando no tempero...",
    "Embrulhando com amor...",
    "A vovó tá quase aí!",
    "Só mais um instantinho..."
  ];

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      const step = current < 70 ? 3 : current < 90 ? 1.5 : 0.7;
      current = Math.min(current + step, 100);
      setProgress(current);
      
      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => setIsFadingOut(true), 400);
      }
    }, 40);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 600);
    return () => clearInterval(msgInterval);
  }, [messages.length]);

  useEffect(() => {
    if (isFadingOut) {
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 500); 
      return () => clearTimeout(timer);
    }
  }, [isFadingOut, onComplete]);

  return (
    <>
      {/* Hidden SVG Filter for Noise */}
      <svg className="hidden">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"></feTurbulence>
        </filter>
      </svg>

      <div 
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center w-[100vw] h-[100dvh] transition-opacity duration-500 ease-in-out ${
          isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="absolute inset-0 bg-pattern"></div>
        <div className="absolute inset-0 noise-overlay"></div>

        <div className="relative z-10 flex flex-col items-center w-full px-6 gap-6">
          
          <div className="text-center flex flex-col items-center">
            <h1 className="font-manual font-semibold text-5xl tracking-tight text-cafe flex items-center gap-3">
              <StarIcon />
              Cantinho da Vovó
              <StarIcon />
            </h1>
            <p className="font-manual italic text-xl text-tomate mt-1">
              preparando seu pedido com carinho...
            </p>
          </div>

          <div className="w-full max-w-[500px]" style={{ width: 'min(500px, 90vw)' }}>
            <svg viewBox="0 0 500 350" className="w-full h-auto drop-shadow-sm" strokeLinejoin="round" strokeLinecap="round">
              
              <g opacity="0.3" stroke="#B43A2F" strokeWidth="4">
                <path d="M 20 180 L 80 180" />
                <path d="M 40 210 L 110 210" />
                <path d="M 10 260 L 60 260" />
                <path d="M 430 280 L 490 280" />
              </g>

              <circle cx="90" cy="80" r="7" fill="#D9913B" className="animate-ponto-flutuar" style={{ animationDelay: '0s' }}/>
              <circle cx="380" cy="50" r="5" fill="#D9913B" className="animate-ponto-flutuar" style={{ animationDelay: '0.4s' }}/>
              <circle cx="450" cy="160" r="8" fill="#D9913B" className="animate-ponto-flutuar" style={{ animationDelay: '0.8s' }}/>

              <g transform="translate(130, 40)" className="animate-estrela-pulsar" style={{ animationDelay: '0s', transformOrigin: '10px 10px' }}>
                <path d="M 10 0 Q 10 10 20 10 Q 10 10 10 20 Q 10 10 0 10 Q 10 10 10 0 Z" fill="#D9913B"/>
              </g>
              <g transform="translate(340, 80)" className="animate-estrela-pulsar" style={{ animationDelay: '0.5s', transformOrigin: '10px 10px' }}>
                <path d="M 10 0 Q 10 10 20 10 Q 10 10 10 20 Q 10 10 0 10 Q 10 10 10 0 Z" fill="#D9913B"/>
              </g>
              <g transform="translate(420, 220)" className="animate-estrela-pulsar" style={{ animationDelay: '1.1s', transformOrigin: '10px 10px' }}>
                <path d="M 10 0 Q 10 10 20 10 Q 10 10 10 20 Q 10 10 0 10 Q 10 10 10 0 Z" fill="#D9913B"/>
              </g>

              <g className="animate-moto-ride origin-bottom">
                
                <circle cx="50" cy="275" r="9" fill="#F5F5F5" className="animate-fumaca-subir" style={{ animationDelay: '0s' }}/>
                <circle cx="35" cy="265" r="13" fill="#F5F5F5" className="animate-fumaca-subir" style={{ animationDelay: '0.2s' }}/>
                <circle cx="15" cy="260" r="11" fill="#F5F5F5" className="animate-fumaca-subir" style={{ animationDelay: '0.4s' }}/>

                <rect x="60" y="270" width="40" height="12" rx="4" fill="#4A2E24" />

                <g transform="translate(140, 280)">
                  <g className="animate-roda-girar" style={{ transformOrigin: '0px 0px' }}>
                    <circle cx="0" cy="0" r="35" fill="#4A2E24" />
                    <circle cx="0" cy="0" r="16" fill="#D9913B" />
                    <line x1="-35" y1="0" x2="35" y2="0" stroke="#FCFAF5" strokeWidth="2" />
                    <line x1="-17.5" y1="-30.3" x2="17.5" y2="30.3" stroke="#FCFAF5" strokeWidth="2" />
                    <line x1="-17.5" y1="30.3" x2="17.5" y2="-30.3" stroke="#FCFAF5" strokeWidth="2" />
                  </g>
                </g>

                <g transform="translate(370, 280)">
                  <g className="animate-roda-girar" style={{ transformOrigin: '0px 0px' }}>
                    <circle cx="0" cy="0" r="35" fill="#4A2E24" />
                    <circle cx="0" cy="0" r="16" fill="#D9913B" />
                    <line x1="-35" y1="0" x2="35" y2="0" stroke="#FCFAF5" strokeWidth="2" />
                    <line x1="-17.5" y1="-30.3" x2="17.5" y2="30.3" stroke="#FCFAF5" strokeWidth="2" />
                    <line x1="-17.5" y1="30.3" x2="17.5" y2="-30.3" stroke="#FCFAF5" strokeWidth="2" />
                  </g>
                </g>

                <rect x="110" y="220" width="280" height="40" rx="18" fill="#B43A2F" />
                <path d="M 370 220 L 390 120 L 360 110 L 320 220 Z" fill="#B43A2F" />
                <rect x="190" y="250" width="100" height="14" rx="5" fill="#4A2E24" />
                
                <path d="M 110 220 Q 80 220 80 250 L 120 250 Z" fill="#B43A2F" />

                {/* Guidão da motinha e Mãozinhas da Vovó */}
                <g>
                  {/* Haste do guidão */}
                  <line x1="380" y1="120" x2="340" y2="85" stroke="#4A2E24" strokeWidth="12" />
                  
                  {/* Braço e Mão (ficam atrás da manopla e do guidão) */}
                  <path d="M 195 170 Q 270 150 330 85" fill="none" stroke="#B43A2F" strokeWidth="16" strokeLinecap="round" />
                  <path d="M 315 80 L 325 100 L 332 95 L 322 70 Z" fill="#FCFAF5" stroke="#4A2E24" strokeWidth="1.5" />
                  
                  {/* Guidão (Manopla horizontal) */}
                  <line x1="320" y1="90" x2="370" y2="75" stroke="#4A2E24" strokeWidth="14" strokeLinecap="round" />
                  
                  {/* Mãozinhas por cima */}
                  <circle cx="330" cy="85" r="10" fill="#FCFAF5" stroke="#4A2E24" strokeWidth="2" />
                  <circle cx="360" cy="77" r="7" fill="#FCFAF5" stroke="#4A2E24" strokeWidth="2" />
                </g>

                <ellipse cx="395" cy="115" rx="12" ry="22" fill="#D9913B" />
                <ellipse cx="400" cy="115" rx="5" ry="14" fill="#FFFFFF" opacity="0.6" className="animate-piscar-farol" />

                {/* A Vovó (Totalmente estilizada com look autêntico!) */}
                
                {/* Corpo / Vestido */}
                <rect x="165" y="115" width="85" height="115" rx="25" fill="#B43A2F" />
                
                {/* Estampa de Bolinhas do Vestido (Padrão de Vovó) */}
                <g fill="#F7EBDD" opacity="0.4">
                  <circle cx="180" cy="135" r="2.5" />
                  <circle cx="200" cy="130" r="2.5" />
                  <circle cx="220" cy="135" r="2.5" />
                  <circle cx="175" cy="155" r="2.5" />
                  <circle cx="195" cy="150" r="2.5" />
                  <circle cx="185" cy="175" r="2.5" />
                  <circle cx="175" cy="195" r="2.5" />
                  <circle cx="190" cy="215" r="2.5" />
                  <circle cx="170" cy="220" r="2.5" />
                </g>

                {/* Avental de Cozinha */}
                <path d="M 200 135 Q 240 145 245 230 L 190 230 Q 185 180 200 135 Z" fill="#FCFAF5" opacity="0.95" />
                
                {/* Bolsinho do Avental com Coraçãozinho */}
                <path d="M 210 185 L 235 185 L 230 210 L 215 210 Z" fill="#F5F5F5" stroke="#E5E7EB" strokeWidth="1" />
                <path d="M 218 195 C 218 192 221 190 223 192 C 225 190 228 192 228 195 C 228 199 223 203 223 203 C 223 203 218 199 218 195 Z" fill="#D9913B" />

                {/* Golinha Redonda (Peter Pan Collar) */}
                <path d="M 175 118 C 190 135 210 130 220 115 C 205 105 190 108 175 118 Z" fill="#FCFAF5" stroke="#4A2E24" strokeWidth="1.5" strokeLinejoin="round" />

                {/* Cabeça */}
                <circle cx="200" cy="90" r="28" fill="#FCFAF5" stroke="#4A2E24" strokeWidth="2" />

                {/* Bochechas Rosadas — corrigidas dentro do círculo do rosto */}
                <circle cx="190" cy="101" r="6" fill="#B43A2F" opacity="0.18" />
                <circle cx="213" cy="101" r="6" fill="#B43A2F" opacity="0.18" />

                {/* Coque de Vovó — cabelo branco com textura de cachinhos */}
                <path d="M 172 75 C 150 60 135 90 150 108 C 160 120 175 110 178 100 Z" fill="#EEEEEE" stroke="#BBBBBB" strokeWidth="1.5" strokeLinejoin="round" />
                {/* Cachinhos dentro do coque */}
                <path d="M 148 72 C 143 78 145 87 151 84" fill="none" stroke="#C0C0C0" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M 139 84 C 134 91 137 100 143 97" fill="none" stroke="#C0C0C0" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M 139 97 C 134 104 138 112 144 108" fill="none" stroke="#C0C0C0" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M 153 68 C 148 74 151 82 157 79" fill="none" stroke="#CACACA" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M 163 65 C 158 71 161 79 167 76" fill="none" stroke="#CACACA" strokeWidth="1.4" strokeLinecap="round" />
                {/* Grampos de cabelo */}
                <line x1="150" y1="85" x2="160" y2="83" stroke="#AAAAAA" strokeWidth="2" strokeLinecap="round" />
                <line x1="149" y1="96" x2="159" y2="94" stroke="#AAAAAA" strokeWidth="2" strokeLinecap="round" />

                {/* Orelha (pequena e autêntica) */}
                <path d="M 226 90 C 230 88 232 92 228 96" fill="#FCFAF5" stroke="#4A2E24" strokeWidth="1.5" />
                {/* Brinco de bolinha dourada */}
                <circle cx="229" cy="96" r="2" fill="#D9913B" />

                {/* Capacete (Half-helmet aberto — cobre só a testa) */}
                <path d="M 168 74 C 166 36 234 36 232 74 Z" fill="#4A2E24" />
                <path d="M 174 74 C 174 54 226 54 226 74" fill="none" stroke="#4A2E24" strokeWidth="4" />

                <rect x="180" y="50" width="34" height="14" rx="4" fill="#D9913B" />
                <text x="184" y="60" fill="#4A2E24" fontSize="10" fontFamily="monospace" fontWeight="600" stroke="none">CVV</text>

                {/* === CABELINHOS BRANCOS SAINDO DO CAPACETE === */}
                {/* Borda esquerda — cachinhos compactos */}
                <path d="M 167 74 C 160 70 157 76 163 80" fill="#EEEEEE" stroke="#CCCCCC" strokeWidth="1.2" />
                <path d="M 170 73 C 164 69 161 75 166 79" fill="#EBEBEB" stroke="#CCCCCC" strokeWidth="1.2" />
                <path d="M 173 72 C 168 68 165 74 169 78" fill="#F0F0F0" stroke="#CCCCCC" strokeWidth="1.2" />
                {/* Mechinhas soltas caindo da lateral esquerda */}
                <path d="M 166 77 C 159 82 158 91 164 94" fill="none" stroke="#D0D0D0" strokeWidth="2" strokeLinecap="round" />
                <path d="M 170 77 C 164 83 163 91 169 94" fill="none" stroke="#CCCCCC" strokeWidth="1.6" strokeLinecap="round" />
                {/* Borda direita — cachinhos compactos */}
                <path d="M 229 73 C 235 69 239 75 234 79" fill="#EEEEEE" stroke="#CCCCCC" strokeWidth="1.2" />
                <path d="M 226 73 C 231 69 235 74 231 78" fill="#EBEBEB" stroke="#CCCCCC" strokeWidth="1.2" />
                {/* Mechinha solta lateral direita */}
                <path d="M 232 76 C 237 82 236 91 231 93" fill="none" stroke="#D0D0D0" strokeWidth="1.8" strokeLinecap="round" />

                {/* Tira do capacete prendendo no queixo */}
                <path d="M 178 76 Q 190 118 203 120" fill="none" stroke="#4A2E24" strokeWidth="2.5" />
                <path d="M 222 76 Q 218 118 207 120" fill="none" stroke="#4A2E24" strokeWidth="2.5" />

                {/* Olhos da Vovó */}
                {/* Olho esquerdo — íris, pupila e brilho */}
                <circle cx="205" cy="84" r="4.5" fill="#7B5030" />
                <circle cx="205" cy="84" r="2.2" fill="#1A100A" />
                <circle cx="207" cy="82" r="1" fill="#FFFFFF" />
                {/* Olho direito — íris, pupila e brilho */}
                <circle cx="225" cy="87" r="4.5" fill="#7B5030" />
                <circle cx="225" cy="87" r="2.2" fill="#1A100A" />
                <circle cx="227" cy="85" r="1" fill="#FFFFFF" />

                {/* Óculos de Vovó */}
                <circle cx="205" cy="85" r="8" fill="none" stroke="#4A2E24" strokeWidth="2.5" />
                <circle cx="225" cy="88" r="8" fill="none" stroke="#4A2E24" strokeWidth="2.5" />
                <line x1="213" y1="86" x2="217" y2="87" stroke="#4A2E24" strokeWidth="2.5" />
                <line x1="185" y1="81" x2="197" y2="83" stroke="#4A2E24" strokeWidth="2.5" />
                {/* Pestanas — olho esquerdo */}
                <line x1="200" y1="77" x2="198" y2="74" stroke="#4A2E24" strokeWidth="1.3" strokeLinecap="round" />
                <line x1="205" y1="77" x2="205" y2="74" stroke="#4A2E24" strokeWidth="1.3" strokeLinecap="round" />
                <line x1="210" y1="77" x2="212" y2="74" stroke="#4A2E24" strokeWidth="1.3" strokeLinecap="round" />
                {/* Pestanas — olho direito */}
                <line x1="220" y1="80" x2="218" y2="77" stroke="#4A2E24" strokeWidth="1.3" strokeLinecap="round" />
                <line x1="225" y1="80" x2="225" y2="77" stroke="#4A2E24" strokeWidth="1.3" strokeLinecap="round" />
                <line x1="230" y1="80" x2="232" y2="77" stroke="#4A2E24" strokeWidth="1.3" strokeLinecap="round" />
                {/* Sobrancelhas — finas e levemente arqueadas, tom grisalho */}
                <path d="M 199 78 Q 205 75 212 77" fill="none" stroke="#7A6050" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M 219 81 Q 225 78 231 80" fill="none" stroke="#7A6050" strokeWidth="1.8" strokeLinecap="round" />

                {/* Correntinha do Óculos Pendurada */}
                <path d="M 198 89 Q 190 102 185 117" fill="none" stroke="#D9913B" strokeWidth="1.5" strokeDasharray="3,2" strokeLinecap="round" />
                <path d="M 218 91 Q 210 107 200 117" fill="none" stroke="#D9913B" strokeWidth="1.5" strokeDasharray="3,2" strokeLinecap="round" />

                {/* Ruguinhas de expressão — ambas dentro do rosto */}
                <path d="M 195 80 Q 192 83 195 86" fill="none" stroke="#4A2E24" strokeWidth="1" strokeLinecap="round" />
                <path d="M 216 84 Q 219 87 216 90" fill="none" stroke="#4A2E24" strokeWidth="1" strokeLinecap="round" />

                {/* Sorriso Caloroso — centralizado */}
                <path d="M 193 108 Q 202 118 214 108" fill="none" stroke="#B43A2F" strokeWidth="2.5" strokeLinecap="round" />
                {/* Covinhas simétricas */}
                <circle cx="193" cy="108" r="1.5" fill="#B43A2F" opacity="0.5" />
                <circle cx="214" cy="108" r="1.5" fill="#B43A2F" opacity="0.5" />

                {/* Lenço no Pescoço (Verde Tempero para contrastar) */}
                <g style={{ transformOrigin: '185px 120px' }} className="animate-lencinho-vento">
                  <path d="M 185 110 L 140 125 L 175 145 Z" fill="#6E7F52" />
                  <circle cx="185" cy="110" r="6" fill="#6E7F52" />
                </g>



                {/* Caixas de Delivery na Garupa */}
                <rect x="65" y="205" width="70" height="15" rx="5" fill="#4A2E24" />
                
                {/* Caixa 1 (Fundo) */}
                <g transform="translate(70, 165)">
                  <rect x="0" y="0" width="70" height="40" rx="6" fill="#4A2E24" />
                  <line x1="35" y1="0" x2="35" y2="40" stroke="#FCFAF5" strokeWidth="2" />
                  <line x1="0" y1="20" x2="70" y2="20" stroke="#FCFAF5" strokeWidth="2" />
                </g>

                {/* Caixa 2 (Meio) */}
                <g transform="translate(75, 125)">
                  <rect x="0" y="0" width="60" height="40" rx="6" fill="#B43A2F" />
                  <line x1="30" y1="0" x2="30" y2="40" stroke="#FCFAF5" strokeWidth="2" />
                  <line x1="0" y1="20" x2="60" y2="20" stroke="#FCFAF5" strokeWidth="2" />
                </g>

                {/* Caixa 3 (Topo - Bamboleando com a Colher de Pau) */}
                <g className="animate-caixa-bamboleia" style={{ transformOrigin: '100px 125px' }}>
                  <g transform="translate(80, 85)">
                    
                    {/* Colher de Pau saindo da caixa */}
                    <g transform="translate(15, -15) rotate(-15)">
                      <line x1="12" y1="20" x2="12" y2="0" stroke="#D9913B" strokeWidth="3" strokeLinecap="round" />
                      <ellipse cx="12" cy="-2" rx="4" ry="6" fill="#F7EBDD" stroke="#4A2E24" strokeWidth="1.5" />
                    </g>

                    <rect x="0" y="0" width="50" height="40" rx="6" fill="#D9913B" />
                    <line x1="25" y1="0" x2="25" y2="40" stroke="#FCFAF5" strokeWidth="2" />
                    <line x1="0" y1="20" x2="50" y2="20" stroke="#FCFAF5" strokeWidth="2" />
                  </g>
                </g>

                {/* Sacola de Papel Pendurada */}
                <g transform="translate(325, 95)">
                  <path d="M 0 0 L 22 0 L 28 45 L -6 45 Z" fill="#F7EBDD" />
                  <path d="M 4 -2 C 4 -14 18 -14 18 -2" fill="none" stroke="#F7EBDD" strokeWidth="2.5" />
                  <path d="M 11 25 C 11 25 5 18 5 14 C 5 10 9 8 11 12 C 13 8 17 10 17 14 C 17 18 11 25 11 25 Z" fill="#B43A2F" />
                </g>

              </g>
            </svg>
          </div>

          <div className="w-full flex flex-col items-center gap-2 mt-4" style={{ width: 'min(420px, 80vw)' }}>
            <div className="w-full flex justify-end">
              <span className="font-mono text-sm text-cafe font-semibold tracking-tight">
                {Math.round(progress)}%
              </span>
            </div>

            <div className="w-full h-[10px] bg-creme-manteiga rounded-full overflow-hidden" style={{ border: '1px solid rgba(74,46,36,0.12)' }}>
              <div 
                className="h-full rounded-full bg-gradient-to-r from-tomate to-dourado shadow-sm"
                style={{ 
                  width: `${progress}%`,
                  transition: 'width 60ms linear' 
                }}
              ></div>
            </div>

            <div className="h-8 flex items-center justify-center mt-2">
              <span 
                key={msgIndex} 
                className="font-manual text-lg text-cafe/50 animate-msg-fade text-center"
              >
                {messages[msgIndex]}
              </span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}