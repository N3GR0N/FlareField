/**
 * Utility functions for FlareField
 */

/**
 * Format a date string to a relative time (e.g., "hace 2 minutos")
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "hace unos segundos";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `hace ${diffInMinutes} minuto${diffInMinutes !== 1 ? "s" : ""}`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `hace ${diffInHours} hora${diffInHours !== 1 ? "s" : ""}`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `hace ${diffInDays} día${diffInDays !== 1 ? "s" : ""}`;
}

/**
 * Get technology impact description based on Kp index
 */
export function getTechImpactDescription(kpIndex: number): string {
  if (kpIndex <= 3) {
    return "Todos los sistemas operando normalmente";
  } else if (kpIndex <= 5) {
    return "Posible deriva de GPS para drones; monitorear operaciones críticas";
  } else if (kpIndex <= 7) {
    return "Operaciones de drones no recomendadas; WiFi satelital degradado; internet escolar inestable";
  } else {
    return "Todos los sistemas afectados; evitar vuelos de drone y operaciones críticas";
  }
}

/**
 * Format coordinates for display
 */
export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? "N" : "S";
  const lngDir = lng >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(3)}°${latDir}, ${Math.abs(lng).toFixed(3)}°${lngDir}`;
}

/**
 * Debounce function for limiting rate of function calls
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => ReturnType<T> {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
