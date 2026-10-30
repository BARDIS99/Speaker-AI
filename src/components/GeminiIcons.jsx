export const ZentraSparkle = ({ className = 'w-5 h-5', size, id = 'zentra_grad' }) => (
  <svg
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path
      d="M14 0C14 7.73199 7.73199 14 0 14C7.73199 14 14 20.268 14 28C14 20.268 20.268 14 28 14C20.268 14 14 7.73199 14 0Z"
      fill={`url(#${id})`}
    />
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="35%" stopColor="#818CF8" />
        <stop offset="70%" stopColor="#C084FC" />
        <stop offset="100%" stopColor="#E879F9" />
      </linearGradient>
    </defs>
  </svg>
);

export const GeminiSparkle = ZentraSparkle;

export const GoogleGIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.27-2.09 3.67-5.17 3.67-9.15z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.27v3.15C3.25 21.3 7.33 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.27 14.24A7.18 7.18 0 0 1 4.89 12c0-.78.14-1.54.38-2.24V6.61H1.27A11.96 11.96 0 0 0 0 12c0 1.92.45 3.74 1.27 5.39l4-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.7 1.27 6.61l4 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
    />
  </svg>
);
