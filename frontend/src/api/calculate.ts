import type { CalculateRequest, CalculateResponse } from '../types/api';

// Android emulator: use 'http://10.0.2.2:8090'
// Physical device: use your machine's local IP
const API_URL = 'http://localhost:8090';

export async function calculate(req: CalculateRequest): Promise<CalculateResponse> {
  const response = await fetch(`${API_URL}/api/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });

  // The backend always returns a { result, error } body, even for 4xx domain
  // errors (e.g. divide by zero), so parse it first and only treat the
  // response as a hard failure if it didn't come back as valid JSON.
  const data = (await response.json()) as CalculateResponse;

  if (!response.ok && data.error == null) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  return data;
}
