import { StyleSheet } from 'react-native';
import { theme } from './theme';

const CONTAINER_PADDING = 16;
const BUTTON_GAP = 12;

export function createStyles(screenWidth: number) {
  const buttonSize = (screenWidth - CONTAINER_PADDING * 2 - BUTTON_GAP * 3) / 4;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: 'flex-end',
      padding: CONTAINER_PADDING,
    },
    display: {
      alignItems: 'flex-end',
      paddingHorizontal: 8,
      paddingBottom: 16,
    },
    displayText: {
      fontSize: 64,
      fontWeight: '300',
      color: theme.colors.textPrimary,
      fontVariant: ['tabular-nums'],
    },
    displayError: {
      fontSize: 24,
      color: theme.colors.error,
    },
    buttonGrid: {
      gap: BUTTON_GAP,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    button: {
      width: buttonSize,
      height: buttonSize,
      borderRadius: buttonSize / 2,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.buttonDefault,
    },
    buttonWide: {
      width: buttonSize * 2 + BUTTON_GAP,
      height: buttonSize,
      borderRadius: buttonSize / 2,
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingLeft: buttonSize * 0.32,
      backgroundColor: theme.colors.buttonDefault,
    },
    buttonFunction: {
      backgroundColor: theme.colors.buttonFunction,
    },
    buttonOperator: {
      backgroundColor: theme.colors.buttonOperator,
    },
    buttonActive: {
      backgroundColor: theme.colors.buttonActiveBackground,
    },
    buttonDisabled: {
      opacity: 0.4,
    },
    buttonText: {
      fontSize: 32,
      fontWeight: '400',
      color: theme.colors.textPrimary,
    },
    buttonTextFunction: {
      color: theme.colors.textInverse,
    },
    buttonTextOperator: {
      color: theme.colors.textPrimary,
    },
    buttonTextActive: {
      color: theme.colors.buttonActiveText,
    },
  });
}

export type CalculatorStyles = ReturnType<typeof createStyles>;
