export function useDebounce(callback: (...args: any[]) => Promise<any>, delay: number) {
  let timeoutId: NodeJS.Timeout | null | any = null;

  return (...args: any[]): Promise<any> => {
    clearTimeout(timeoutId);
    return new Promise((resolve, reject) => {
      timeoutId = setTimeout(async () => {
        try {
          const result = await callback(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
}