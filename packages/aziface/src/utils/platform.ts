export function isMobile(): boolean {
  if (typeof navigator === 'undefined') return false;

  const isTouchable =
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: coarse)').matches;

  return (
    isTouchable ||
    window.innerWidth <= 768 ||
    /Android.*Mobile|iPhone|iPod|Windows Phone/i.test(navigator.userAgent)
  );
}
