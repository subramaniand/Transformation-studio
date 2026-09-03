/**
 * useAsync hook - Handle async operations with loading and error states
 */
import { useState, useEffect, useCallback } from 'react';

export function useAsync(asyncFunction, immediate = true) {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    setStatus('pending');
    setData(null);
    setError(null);

    try {
      const response = await asyncFunction();
      setData(response);
      setStatus('success');
      return response;
    } catch (err) {
      setError(err);
      setStatus('error');
      return null;
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (!immediate) return;

    execute();
  }, [execute, immediate]);

  return {
    status,
    data,
    error,
    isLoading: status === 'pending',
    isSuccess: status === 'success',
    isError: status === 'error',
    execute,
  };
}

export default useAsync;
