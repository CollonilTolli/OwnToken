export function useDebounce<T extends (...args: any[]) => any, R extends ReturnType<T>>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => Promise<R> {
  let timeoutId: NodeJS.Timeout | null | any = null;

  return async (...args: Parameters<T>): Promise<R> => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      try{ 
        callback(...args);
      }catch(error){
        console.error("Error in debounced callback:", error);
      }

    }, delay);
    return (await callback(...args)) as R; //Explicit cast
  };
}


