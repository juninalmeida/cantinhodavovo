interface VovoIconProps {
  size?: number
  className?: string
}

export function VovoIcon({ size = 38, className = '' }: VovoIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`overflow-visible ${className}`}
    >
      <g className="origin-bottom transition-transform duration-500 group-hover:-translate-y-[2px]">
        <path d="M16 58 C16 46 22 40 32 40 C42 40 48 46 48 58 Z" fill="#B43A2F" />
        <path d="M24 40 Q 32 46 40 40 L 32 48 Z" fill="#FFFFFF" />
        <circle cx="32" cy="14" r="9" fill="#E8E8E8" stroke="#D0D0D0" strokeWidth="1" />
        <path d="M16 30 C16 16 48 16 48 30 C50 36 50 42 48 46 C45 42 19 42 16 46 C14 42 14 36 16 30 Z" fill="#E8E8E8" stroke="#D0D0D0" strokeWidth="1" />
        <path d="M20 26 C20 18 44 18 44 26 C44 38 40 44 32 44 C24 44 20 38 20 26 Z" fill="#F5D5BE" />
        <circle cx="19" cy="30" r="3" fill="#F5D5BE" />
        <circle cx="45" cy="30" r="3" fill="#F5D5BE" />
        <circle cx="18" cy="32" r="1.5" fill="#B43A2F" />
        <circle cx="46" cy="32" r="1.5" fill="#B43A2F" />
        <g className="transition-opacity duration-300">
          <circle cx="24" cy="33" r="3" fill="#E07070" className="opacity-40 group-hover:opacity-60" />
          <circle cx="40" cy="33" r="3" fill="#E07070" className="opacity-40 group-hover:opacity-60" />
        </g>
        <path
          d="M28 37 Q 32 42 36 37"
          stroke="#B43A2F"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          className="origin-center transition-transform duration-300 group-hover:scale-110"
        />
        <path d="M31 31 Q 32 33 33 31" stroke="#C8A58E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <circle cx="26" cy="28" r="6" fill="white" fillOpacity="0.3" stroke="#4A2E24" strokeWidth="2.5" />
        <circle cx="38" cy="28" r="6" fill="white" fillOpacity="0.3" stroke="#4A2E24" strokeWidth="2.5" />
        <path d="M31 28 Q 32 26 33 28" stroke="#4A2E24" strokeWidth="2.5" fill="none" />
        <circle cx="26" cy="28" r="1.5" fill="#4A2E24" className="transition-opacity duration-300 group-hover:opacity-0" />
        <circle cx="38" cy="28" r="1.5" fill="#4A2E24" className="transition-opacity duration-300 group-hover:opacity-0" />
        <path d="M24 28 Q 26 25 28 28" stroke="#4A2E24" strokeWidth="2" strokeLinecap="round" fill="none" className="opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <path d="M36 28 Q 38 25 40 28" stroke="#4A2E24" strokeWidth="2" strokeLinecap="round" fill="none" className="opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </g>

      <g className="origin-[50px_48px] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-1 group-hover:-rotate-[15deg]">
        <rect x="48" y="24" width="4" height="26" rx="2" fill="#D9913B" />
        <ellipse cx="50" cy="20" rx="6" ry="10" fill="#D9913B" />
        <ellipse cx="50" cy="18" rx="3" ry="5" fill="#C07525" fillOpacity="0.4" />
        <circle cx="50" cy="42" r="5" fill="#F5D5BE" />
        <g className="origin-bottom opacity-0 transition-opacity duration-500 group-hover:animate-steam-pulse group-hover:opacity-100">
          <path d="M48 8 Q 45 4 50 0" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" filter="blur(1px)" />
          <path d="M52 10 Q 55 6 48 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" filter="blur(1px)" />
        </g>
      </g>
    </svg>
  )
}
