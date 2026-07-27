import { Text, View } from 'react-native';
import type { CalculatorStyles } from '../styles/calculator';

type CalculatorDisplayProps = {
  styles: CalculatorStyles;
  value: string;
  isError: boolean;
};

export function CalculatorDisplay({ styles, value, isError }: CalculatorDisplayProps) {
  return (
    <View style={styles.display}>
      <Text
        testID="display"
        style={[styles.displayText, isError && styles.displayError]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {value}
      </Text>
    </View>
  );
}
