export function useDebounce<T extends (...args: any[]) => Promise<any>>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeoutId: NodeJS.Timeout | null | any= null;

  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(async () => {
      try {
        await callback(...args);  
      } catch (error) {
        console.error("Error in debounced callback:", error);
      }
    }, delay);
    return callback(...args);  
  };
}

