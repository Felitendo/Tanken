#!/usr/bin/env python3
"""Regenerates composeApp/src/commonMain/kotlin/gg/felo/tanken/i18n/Strings.kt
from the PWA's i18n catalog (public/app.js). Run from the repo root:

    node -e "const fs=require('fs');const src=fs.readFileSync('public/app.js','utf8');\
const end=src.indexOf('function t(key)');const i18n=eval(src.slice(0,end)+'; i18n');\
fs.writeFileSync('/tmp/i18n.json', JSON.stringify(i18n))"
    python3 mobile/tools/gen-strings.py /tmp/i18n.json
"""
import json
import sys

OUT = 'mobile/composeApp/src/commonMain/kotlin/gg/felo/tanken/i18n/Strings.kt'


def kesc(s):
    return (
        s.replace('\\', '\\\\').replace('"', '\\"').replace('$', '\\$').replace('\n', '\\n')
    )


def main(path):
    i18n = json.load(open(path))
    de, en = i18n['de'], i18n['en']
    for k in de:  # keys missing in one language fall back to German
        en.setdefault(k, de[k])
    keys = list(de.keys())

    lines = [
        'package gg.felo.tanken.i18n',
        '',
        '// GENERATED from the PWA i18n catalog (public/app.js) — regenerate with',
        '// mobile/tools/gen-strings.py rather than editing by hand.',
        '',
        '@Suppress("LongParameterList")',
        'class Strings(',
    ]
    for k in keys:
        t = 'List<String>' if isinstance(de[k], list) else 'String'
        lines.append(f'    val {k}: {t},')
    lines.append(')')
    lines.append('')
    for lang, cat in (('De', de), ('En', en)):
        lines.append(f'val Strings{lang} = Strings(')
        for k in keys:
            v = cat[k]
            if isinstance(v, list):
                items = ', '.join(f'"{kesc(x)}"' for x in v)
                lines.append(f'    {k} = listOf({items}),')
            else:
                lines.append(f'    {k} = "{kesc(v)}",')
        lines.append(')')
        lines.append('')
    lines += [
        '/** Replaces `{name}` template slots, e.g. `periodLastDays.fmt("n" to "31")`. */',
        'fun String.fmt(vararg args: Pair<String, String>): String {',
        '    var out = this',
        '    args.forEach { (k, v) -> out = out.replace("{$k}", v) }',
        '    return out',
        '}',
    ]
    open(OUT, 'w').write('\n'.join(lines) + '\n')
    print(f'generated {len(keys)} keys -> {OUT}')


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else '/tmp/i18n.json')
