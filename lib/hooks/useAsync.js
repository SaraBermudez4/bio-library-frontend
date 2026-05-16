'use client';

import { useState, useCallback } from 'react';
import { extractErrorMessage } from '@/lib/utils/error';

export function useAsync() {
  const [state, setState] = useState({
    data: null,
    error: null,
    isLoading: false,
  });

  const execute = useCallback(async (asyncFn) => {
    setState({ data: null, error: null, isLoading: true });
    try {
      const data = await asyncFn();
      setState({ data, error: null, isLoading: false });
      return data;
    } catch (err) {
      const message = extractErrorMessage(err);
      setState({ data: null, error: message, isLoading: false });
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, error: null, isLoading: false });
  }, []);

  return { ...state, execute, reset };
}
