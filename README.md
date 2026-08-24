# Lightweight Share Buttons

A single, dynamic WordPress block for private and lightweight page sharing. It includes Native Share, Copy Link, Facebook, WhatsApp, LinkedIn, email, Telegram, X, Bluesky, Threads, and Reddit.

## Requirements

- WordPress 6.6+
- PHP 7.4+
- Node.js 20.19+ and npm 10.2+ for development

## Development

```sh
npm install
npm run start
```

Create production assets and the installable ZIP:

```sh
npm run build
npm run plugin-zip
```

The distributed `build/` directory is generated from `src/`. The plugin has no runtime package dependencies, remote scripts, analytics, settings screen, database options, or uninstall routine.

## Translation

The text domain is `lightweight-share-buttons`. JavaScript and PHP user-facing strings use WordPress internationalization functions. Translation sources can be extracted with WP-CLI:

```sh
wp i18n make-pot . languages/lightweight-share-buttons.pot --exclude=node_modules
```

Polish translations are included in `languages/lightweight-share-buttons-pl_PL.po`.

Bundled translations are available for Albanian, Arabic, Chinese (Simplified), Czech, Danish, Dutch, Estonian, Finnish, French, Georgian, German, Greek, Hebrew, Hindi, Italian, Japanese, Korean, Latin, Lithuanian, Polish, Portuguese, Romanian, Russian, Serbian, Slovak, Slovenian, Spanish, Swedish, Thai, Turkish, and Ukrainian.

## Privacy

No request is made to a sharing service before the visitor clicks its button. No data, cookies, telemetry, or share history are collected.

## License

GPL-2.0-or-later.
