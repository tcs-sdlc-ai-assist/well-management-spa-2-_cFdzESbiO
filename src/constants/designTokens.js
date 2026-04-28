/**
 * Design system tokens for the Well Management SPA.
 * All values are Tailwind CSS utility class strings.
 * @module designTokens
 */

export const designTokens = {
  backgrounds: {
    primary: 'bg-stone-950',
    secondary: 'bg-stone-900',
    tertiary: 'bg-stone-800',
    hover: 'bg-stone-800/50',
    overlay: 'bg-black/50',
  },

  text: {
    primary: 'text-white',
    secondary: 'text-stone-400',
    muted: 'text-stone-500',
    heading: 'text-stone-100',
    inverse: 'text-stone-950',
  },

  borders: {
    default: 'border-stone-700',
    light: 'border-stone-600',
    dark: 'border-stone-800',
  },

  activeRow: {
    base: 'border-l-4 border-emerald-500 bg-stone-800/50',
  },

  badge: {
    active: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
    inactive: 'bg-stone-500/10 text-stone-400 border border-stone-500/20',
  },

  button: {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-stone-950',
    success: 'bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-stone-950',
    secondary: 'bg-stone-800 text-stone-100 border border-stone-700 hover:bg-stone-700 focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 focus:ring-offset-stone-950',
    outline: 'bg-transparent text-stone-100 border border-stone-700 hover:bg-stone-800 focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 focus:ring-offset-stone-950',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-stone-950',
    base: 'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
    size: {
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    },
  },

  input: {
    base: 'w-full rounded-lg border bg-stone-800 border-stone-700 text-stone-100 placeholder-stone-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-colors duration-150',
    size: {
      md: 'px-3 py-2 text-sm',
      lg: 'px-4 py-3 text-base',
    },
    error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
    label: 'block text-sm font-medium text-stone-300 mb-1',
    helperText: 'mt-1 text-xs text-stone-500',
    errorText: 'mt-1 text-xs text-red-400',
  },

  modal: {
    overlay: 'fixed inset-0 bg-black/50 flex items-center justify-center z-50',
    container: 'bg-stone-900 rounded-xl shadow-xl w-full max-w-md mx-4',
    header: 'flex items-center justify-between p-4 border-b border-stone-700',
    body: 'p-4',
    footer: 'flex items-center justify-end gap-3 p-4 border-t border-stone-700',
    title: 'text-lg font-semibold text-white',
    activation: 'border border-emerald-500/30',
    warning: 'border border-red-500/30',
  },

  table: {
    wrapper: 'w-full overflow-x-auto',
    base: 'w-full text-left',
    header: 'bg-stone-900 text-stone-400 text-xs uppercase tracking-wider',
    headerCell: 'px-4 py-3 font-medium',
    row: 'border-b border-stone-800 hover:bg-stone-800/50 transition-colors duration-150',
    cell: 'px-4 py-3 text-sm text-stone-100',
  },

  pulsingDot: 'relative flex h-2.5 w-2.5',
  pulsingDotInner: 'animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75',
  pulsingDotCore: 'relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500',

  borderRadius: {
    sm: 'rounded',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  },

  fontWeight: {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  },

  transition: {
    colors: 'transition-colors duration-150',
    all: 'transition-all duration-200',
  },

  variants: {
    button: ['primary', 'success', 'secondary', 'outline', 'danger'],
    badge: ['active', 'inactive'],
    modal: ['activation', 'warning'],
    buttonSize: ['md', 'lg'],
    inputSize: ['md', 'lg'],
  },
};

export default designTokens;