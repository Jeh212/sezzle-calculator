import { View } from 'react-native';
import type { CalculatorStyles } from '../styles/calculator';
import type { CalculatorControls } from '../hooks/useCalculator';
import { CalculatorButton } from './CalculatorButton';

type CalculatorKeypadProps = {
  styles: CalculatorStyles;
  calculator: CalculatorControls;
};

export function CalculatorKeypad({ styles, calculator }: CalculatorKeypadProps) {
  return (
    <View style={styles.buttonGrid}>
      <View style={styles.row}>
        <CalculatorButton styles={styles} label="C" onPress={calculator.pressClear} variant="function" />
        <CalculatorButton styles={styles} label="+/-" onPress={calculator.pressToggleSign} variant="function" />
        <CalculatorButton styles={styles} label="%" onPress={calculator.pressPercent} variant="function" />
        <CalculatorButton
          styles={styles}
          label="÷"
          onPress={() => calculator.pressOperation('divide')}
          variant="operator"
          active={calculator.pendingOp === 'divide'}
        />
      </View>

      <View style={styles.row}>
        <CalculatorButton styles={styles} label="7" onPress={() => calculator.pressDigit('7')} />
        <CalculatorButton styles={styles} label="8" onPress={() => calculator.pressDigit('8')} />
        <CalculatorButton styles={styles} label="9" onPress={() => calculator.pressDigit('9')} />
        <CalculatorButton
          styles={styles}
          label="×"
          onPress={() => calculator.pressOperation('multiply')}
          variant="operator"
          active={calculator.pendingOp === 'multiply'}
        />
      </View>

      <View style={styles.row}>
        <CalculatorButton styles={styles} label="4" onPress={() => calculator.pressDigit('4')} />
        <CalculatorButton styles={styles} label="5" onPress={() => calculator.pressDigit('5')} />
        <CalculatorButton styles={styles} label="6" onPress={() => calculator.pressDigit('6')} />
        <CalculatorButton
          styles={styles}
          label="−"
          onPress={() => calculator.pressOperation('subtract')}
          variant="operator"
          active={calculator.pendingOp === 'subtract'}
        />
      </View>

      <View style={styles.row}>
        <CalculatorButton styles={styles} label="1" onPress={() => calculator.pressDigit('1')} />
        <CalculatorButton styles={styles} label="2" onPress={() => calculator.pressDigit('2')} />
        <CalculatorButton styles={styles} label="3" onPress={() => calculator.pressDigit('3')} />
        <CalculatorButton
          styles={styles}
          label="+"
          onPress={() => calculator.pressOperation('add')}
          variant="operator"
          active={calculator.pendingOp === 'add'}
        />
      </View>

      <View style={styles.row}>
        <CalculatorButton styles={styles} label="0" onPress={() => calculator.pressDigit('0')} wide />
        <CalculatorButton styles={styles} label="." onPress={calculator.pressDecimal} />
        <CalculatorButton
          styles={styles}
          label={calculator.loading ? '…' : '='}
          onPress={calculator.pressEquals}
          variant="operator"
          disabled={calculator.loading}
        />
      </View>
    </View>
  );
}
