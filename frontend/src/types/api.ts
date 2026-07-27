export interface CalculateRequest {
  operand1: number;
  operand2: number;
  operation: 'add' | 'subtract' | 'multiply' | 'divide';
}

export interface CalculateResponse {
  result: number | null;
  error: string | null;
}
