// setup-tests.d.ts
import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveTextContent(text: string): R;
      toHaveValue(value: string | number | string[]): R;
      // Agrega aquí otros matchers que necesites
    }
  }
}