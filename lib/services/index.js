import * as real from './real';
import * as mocks from '@/lib/mocks/services';

const useMocks = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';
const { authService, bookService, loanService, studentService } = useMocks
  ? mocks
  : real;

export { authService, bookService, loanService, studentService };
