// src/components/atoms/Button/Button.styles.ts
import { StyleSheet } from 'react-native';
import { theme } from '../../../theme'; // Import the theme

export const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primary.main,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  text: {
    color: theme.colors.primary.contrastText,
    fontSize: 16,
    fontWeight: theme.typography.fontWeights.bold as 'bold',
  },
});