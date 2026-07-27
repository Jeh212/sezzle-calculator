import { Text, TouchableOpacity } from 'react-native';
import type { CalculatorStyles } from '../styles/calculator';

type CalculatorButtonProps = {
  styles: CalculatorStyles;
  label: string;
  onPress: () => void;
  variant?: 'default' | 'function' | 'operator';
  wide?: boolean;
  active?: boolean;
  disabled?: boolean;
};

export function CalculatorButton({
  styles,
  label,
  onPress,
  variant = 'default',
  wide,
  active,
  disabled,
}: CalculatorButtonProps) {
  const containerStyle = [
    wide ? styles.buttonWide : styles.button,
    variant === 'function' && styles.buttonFunction,
    variant === 'operator' && styles.buttonOperator,
    active && styles.buttonActive,
    disabled && styles.buttonDisabled,
  ];

  const textStyle = [
    styles.buttonText,
    variant === 'function' && styles.buttonTextFunction,
    active && styles.buttonTextActive,
  ];

  return (
    <TouchableOpacity
      testID={`key-${label}`}
      style={containerStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={textStyle}>{label}</Text>
    </TouchableOpacity>
  );
}
