import { useState } from 'react';
import { calculate } from '../api/calculate';
import type { CalculateRequest } from '../types/api';

export type Operation = CalculateRequest['operation'];

type CalculatorState = {
  display: string;
  operand1: number | null;
  pendingOp: Operation | null;
  awaitingOperand2: boolean;
  error: string | null;
};

const INITIAL_STATE: CalculatorState = {
  display: '0',
  operand1: null,
  pendingOp: null,
  awaitingOperand2: false,
  error: null,
};

function formatResult(n: number): string {
  return Number(n.toFixed(10)).toString();
}

export function useCalculator() {
  const [state, setState] = useState<CalculatorState>(INITIAL_STATE);
  const [loading, setLoading] = useState(false);

  function pressDigit(digit: string) {
    setState(prev => {
      if (prev.error) return { ...INITIAL_STATE, display: digit };

      const base = prev.awaitingOperand2 ? '0' : prev.display;
      const next = base === '0' && digit !== '.' ? digit : base + digit;

      return {
        ...prev,
        display: next,
        awaitingOperand2: false,
        error: null,
      };
    });
  }

  function pressOperation(op: Operation) {
    setState(prev => ({
      ...prev,
      operand1: parseFloat(prev.display),
      pendingOp: op,
      awaitingOperand2: true,
      error: null,
    }));
  }

  function pressDecimal() {
    setState(prev => {
      const base = prev.awaitingOperand2 ? '0' : prev.display;
      if (base.includes('.')) return prev;
      return { ...prev, display: base + '.', awaitingOperand2: false };
    });
  }

  function pressEquals() {
    if (state.operand1 === null || !state.pendingOp) return;

    const req: CalculateRequest = {
      operand1: state.operand1,
      operand2: parseFloat(state.display),
      operation: state.pendingOp,
    };

    setLoading(true);
    calculate(req)
      .then(resp => {
        if (resp.error) {
          setState({ ...INITIAL_STATE, display: '0', error: resp.error });
        } else {
          setState({ ...INITIAL_STATE, display: formatResult(resp.result ?? 0) });
        }
      })
      .catch(() => {
        setState({ ...INITIAL_STATE, error: 'Network error' });
      })
      .finally(() => setLoading(false));
  }

  function pressClear() {
    setState(INITIAL_STATE);
  }

  function pressToggleSign() {
    setState(prev => ({ ...prev, display: String(-parseFloat(prev.display)) }));
  }

  function pressPercent() {
    setState(prev => ({ ...prev, display: String(parseFloat(prev.display) / 100) }));
  }

  return {
    displayValue: state.error ?? state.display,
    isError: !!state.error,
    loading,
    pendingOp: state.pendingOp,
    pressClear,
    pressDecimal,
    pressDigit,
    pressEquals,
    pressOperation,
    pressPercent,
    pressToggleSign,
  };
}

export type CalculatorControls = ReturnType<typeof useCalculator>;
