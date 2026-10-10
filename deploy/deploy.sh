#!/usr/bin/env bash
# Baut solmization und spielt den Build auf den Server ein.
# Aufruf: npm run deploy   (Ziel überschreibbar: SOLMIZATION_HOST=root@… npm run deploy)
set -euo pipefail

HOST="${SOLMIZATION_HOST:-root@solmization.kalikoer.com}"
ZIEL=/var/www/solmization

cd "$(dirname "$0")/.."
npm run build

# Erst in ein neues Verzeichnis entpacken, dann austauschen – so sieht niemand einen halben Stand.
tar -C dist -cf - . | ssh "$HOST" "set -e
  rm -rf $ZIEL.neu && mkdir -p $ZIEL.neu
  tar -C $ZIEL.neu --no-same-owner -xf -
  chmod -R a+rX $ZIEL.neu
  if [ -d $ZIEL ]; then mv $ZIEL $ZIEL.alt; fi
  mv $ZIEL.neu $ZIEL
  rm -rf $ZIEL.alt"

echo "Eingespielt auf $HOST:$ZIEL"
