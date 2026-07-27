import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { CalculatorDisplay } from './src/components/CalculatorDisplay';
import { CalculatorKeypad } from './src/components/CalculatorKeypad';
import { useCalculator } from './src/hooks/useCalculator';
import { createStyles } from './src/styles/calculator';

export default function App() {
  const { width } = useWindowDimensions();
  const styles = useMemo(() => createStyles(width), [width]);
  const calculator = useCalculator();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <CalculatorDisplay styles={styles} value={calculator.displayValue} isError={calculator.isError} />
      <CalculatorKeypad styles={styles} calculator={calculator} />
    </View>
  );
}
