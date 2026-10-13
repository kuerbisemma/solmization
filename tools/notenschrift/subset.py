# Erzeugt public/fonts/solmi-noten-2.woff2 als umbenannten Auszug aus Bravura (SIL OFL 1.1).
# Aufruf: python tools/notenschrift/subset.py <Pfad zu Bravura.otf>
# Bravura: https://github.com/steinbergmedia/bravura (redist/otf/Bravura.otf)
# Bei geänderter Glyphenauswahl die Nummer im Dateinamen erhöhen (index.html, src/stil.css, LICENSE): /fonts/ wird
# ohne Hash ausgeliefert und einen Tag lang gecacht.

import sys
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont

# SMuFL-Codepunkte, die Notenzeile.svelte verwendet
GLYPHEN = {
    0xE050: 'gClef',
    0xE052: 'gClef8vb',
    0xE062: 'fClef',
    0xE082: 'timeSig2',
    0xE083: 'timeSig3',
    0xE084: 'timeSig4',
    0xE0A2: 'noteheadWhole',
    0xE0A3: 'noteheadHalf',
    0xE0A4: 'noteheadBlack',
    0xE1E7: 'augmentationDot',
    0xE240: 'flag8thUp',
    0xE241: 'flag8thDown',
    0xE260: 'accidentalFlat',
    0xE262: 'accidentalSharp',
    0xE4E3: 'restWhole',
    0xE4E4: 'restHalf',
    0xE4E5: 'restQuarter',
    0xE4E6: 'rest8th',
}

NAMEN = {
    0: 'Glyphs from Bravura, Copyright 2026 Steinberg Media Technologies GmbH. Modified (subset) for solmization.',
    1: 'Solmi Noten',
    2: 'Regular',
    3: 'Solmi Noten',
    4: 'Solmi Noten',
    6: 'SolmiNoten',
    13: 'This Font Software is licensed under the SIL Open Font License, Version 1.1.',
    14: 'https://openfontlicense.org',
}


def main(quelle: str) -> None:
    ziel = Path(__file__).resolve().parents[2] / 'public' / 'fonts' / 'solmi-noten-2.woff2'
    font = TTFont(quelle)
    optionen = subset.Options()
    optionen.flavor = 'woff2'
    optionen.name_IDs = []
    optionen.layout_features = []
    sub = subset.Subsetter(optionen)
    sub.populate(unicodes=GLYPHEN.keys())
    sub.subset(font)
    # Reserved Font Name „Bravura“ darf in der veränderten Fassung nicht stehen.
    font['name'].names = []
    for nid, text in NAMEN.items():
        font['name'].setName(text, nid, 3, 1, 0x409)
    font.flavor = 'woff2'
    font.save(ziel)
    print(f'{ziel} ({ziel.stat().st_size} Bytes)')


if __name__ == '__main__':
    main(sys.argv[1])
