import { TextStyle } from 'react-native';

export const TYPOGRAPHY: Record<string, TextStyle> = {
  title: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  quote: {
    fontSize: 28,
    fontWeight: '600',
    letterSpacing: -0.4,
    lineHeight: 36,
  },
};
