package calculator

import "errors"

var ErrDivisionByZero = errors.New("Cannot divide by zero")
var ErrUnknownOperation = errors.New("unknown operation")

func Calculate(operand1, operand2 float64, operation string) (float64, error) {
	switch operation {
	case "add":
		return operand1 + operand2, nil
	case "subtract":
		return operand1 - operand2, nil
	case "multiply":
		return operand1 * operand2, nil
	case "divide":
		if operand2 == 0 {
			return 0, ErrDivisionByZero
		}
		return operand1 / operand2, nil
	default:
		return 0, ErrUnknownOperation
	}
}
