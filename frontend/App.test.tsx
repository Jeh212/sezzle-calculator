import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import App from './App';
import { calculate } from './src/api/calculate';

jest.mock('./src/api/calculate');

const mockedCalculate = calculate as jest.MockedFunction<typeof calculate>;

function press(testID: string) {
  fireEvent.press(screen.getByTestId(testID));
}

function displayValue(): string {
  return screen.getByTestId('display').props.children;
}

describe('Calculator', () => {
  beforeEach(() => {
    mockedCalculate.mockReset();
  });

  it('starts with a display of 0', () => {
    render(<App />);
    expect(displayValue()).toBe('0');
  });

  it('builds a number from digit presses', () => {
    render(<App />);
    press('key-1');
    press('key-2');
    expect(displayValue()).toBe('12');
  });

  it('ignores a second decimal point', () => {
    render(<App />);
    press('key-1');
    press('key-.');
    press('key-5');
    press('key-.');
    press('key-6');
    expect(displayValue()).toBe('1.56');
  });

  it('sends operand1, operand2 and operation to the backend on equals', async () => {
    mockedCalculate.mockResolvedValue({ result: 15, error: null });

    render(<App />);
    press('key-1');
    press('key-0');
    press('key-+');
    press('key-5');
    press('key-=');

    await waitFor(() => expect(displayValue()).toBe('15'));

    expect(mockedCalculate).toHaveBeenCalledWith({
      operand1: 10,
      operand2: 5,
      operation: 'add',
    });
  });

  it('shows the backend error message for divide by zero', async () => {
    mockedCalculate.mockResolvedValue({ result: null, error: 'Cannot divide by zero' });

    render(<App />);
    press('key-5');
    press('key-÷');
    press('key-0');
    press('key-=');

    await waitFor(() => expect(displayValue()).toBe('Cannot divide by zero'));
  });

  it('recovers from an error state on the next digit press', async () => {
    mockedCalculate.mockResolvedValue({ result: null, error: 'Cannot divide by zero' });

    render(<App />);
    press('key-5');
    press('key-÷');
    press('key-0');
    press('key-=');
    await waitFor(() => expect(displayValue()).toBe('Cannot divide by zero'));

    press('key-7');
    expect(displayValue()).toBe('7');
  });

  it('resets to 0 when C is pressed', () => {
    render(<App />);
    press('key-7');
    press('key-C');
    expect(displayValue()).toBe('0');
  });
});
