// ✅ UTILIDAD: Medición de rendimiento para debugging
export function measurePerformance<T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    const startTime = Date.now();
    console.log(`⏱️ Starting ${operationName}...`);
    
    try {
      const result = await operation();
      const duration = Date.now() - startTime;
      
      // ✅ Log con colores según el tiempo
      if (duration < 100) {
        console.log(`✅ ${operationName} completed in ${duration}ms (fast)`);
      } else if (duration < 500) {
        console.log(`⚠️ ${operationName} completed in ${duration}ms (slow)`);
      } else {
        console.log(`🐌 ${operationName} completed in ${duration}ms (very slow)`);
      }
      
      resolve(result);
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`❌ ${operationName} failed after ${duration}ms:`, error);
      reject(error);
    }
  });
}

export function logSlowQuery(queryName: string, duration: number, threshold = 1000) {
  if (duration > threshold) {
    console.warn(`🐌 SLOW QUERY DETECTED: ${queryName} took ${duration}ms (threshold: ${threshold}ms)`);
  }
}
