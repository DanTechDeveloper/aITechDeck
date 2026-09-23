export const colors = {
  bg: '#F5F6F7',
  surface: '#FFFFFF',
  border: '#DDE1E6',
  borderStrong: '#A8B0B8',
  text: '#141A1F',
  textMuted: '#5C6670',
  textOnPrimary: '#FFFFFF',
  primary: '#0F766E',
  primaryDark: '#0B5D57',
  primarySoft: '#CDEFEA',
  danger: '#B3261E',
  dangerSoft: '#FBE4E2',
  focusRing: '#0F766E',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
} as const;

export const typography = {
  headline: { fontSize: 28, fontWeight: '700', lineHeight: 36 } as const,
  title: { fontSize: 20, fontWeight: '700', lineHeight: 28 } as const,
  label: { fontSize: 14, fontWeight: '600', lineHeight: 20 } as const,
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24 } as const,
  caption: { fontSize: 13, fontWeight: '400', lineHeight: 18 } as const,
  input: { fontSize: 16, fontWeight: '400', lineHeight: 24 } as const,
} as const;