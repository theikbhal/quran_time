export const themeColors = {
  dark: {
    bg: '#0D1117',
    bgCard: '#161B22',
    bgSecondary: '#1C2433',
    border: '#30373F',
    text: '#E6EDF3',
    textMuted: '#8B949E',
    accent: '#3FB68A', // Emerald green
    gold: '#D4A017',
    shadow: 'rgba(63, 182, 138, 0.15)',
    statusComplete: '#3FB68A',
    statusPartial: '#D4A017',
    statusNo: '#F47575',
  },
  light: {
    bg: '#FAFAF7',
    bgCard: '#FFFFFF',
    bgSecondary: '#F0EDE4',
    border: '#DDD8CC',
    text: '#1A1714',
    textMuted: '#7A7265',
    accent: '#1B6B3A', // Forest green
    gold: '#B8860B',
    shadow: 'rgba(27, 107, 58, 0.08)',
    statusComplete: '#1B6B3A',
    statusPartial: '#B8860B',
    statusNo: '#F47575',
  },
  night: {
    bg: '#08080F',
    bgCard: '#0E0E1A',
    bgSecondary: '#18182D',
    border: '#2A2A4A',
    text: '#C8C8E8',
    textMuted: '#7E7EA6',
    accent: '#7C5CBF', // Purple
    gold: '#C8A84B',
    shadow: 'rgba(124, 92, 191, 0.2)',
    statusComplete: '#7C5CBF',
    statusPartial: '#C8A84B',
    statusNo: '#F47575',
  }
};

export type ThemeType = 'dark' | 'light' | 'night';
export type ActiveTheme = typeof themeColors.dark;
