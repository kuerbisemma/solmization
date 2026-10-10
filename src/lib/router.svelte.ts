// Minimales Hash-Routing – funktioniert ohne Serverkonfiguration und offline.

export type Seite =
  | 'start'
  | 'einfuehrung'
  | 'tafel'
  | 'ueben'
  | 'singen'
  | 'statistik'
  | 'impressum'
  | 'datenschutz'
  | 'credits';

const SEITEN: Seite[] = ['start', 'einfuehrung', 'tafel', 'ueben', 'singen', 'statistik', 'impressum', 'datenschutz', 'credits'];

function ausHash(): Seite {
  const name = location.hash.replace(/^#\/?/, '') as Seite;
  return SEITEN.includes(name) ? name : 'start';
}

export const route = $state({ seite: ausHash() });

window.addEventListener('hashchange', () => {
  route.seite = ausHash();
  window.scrollTo(0, 0);
});

export function href(seite: Seite): string {
  return seite === 'start' ? '#/' : `#/${seite}`;
}

export function gehe(seite: Seite) {
  location.hash = href(seite);
}
