# Add support for Updater in your plugin

Add the required Updater manifest entry to your plugin:

```json
"updater": {
    "plugin": "URL to latest raw plugin js",
    "manifest": "URL to latest raw manifest json",
    "changelog": "Some information about what the update changed",
    "source": "URL to source code of plugin"
},
```

Example:

```json
{
  "name": "Stealmoji",
  "version": "1.1.0",
  "description": "Add emojis to your servers quickly and easily",
  "authors": [
    {
      "name": "Fiery",
      "id": "890228870559698955"
    }
  ],
  "updater": {
    "plugin": "https://github.com/FierysDiscordAddons/Stealmoji/releases/latest/download/Stealmoji.js",
    "manifest": "https://github.com/FierysDiscordAddons/Stealmoji/releases/latest/download/manifest.json",
    "changelog": "Add Updater support",
    "source": "https://github.com/FierysDiscordAddons/Stealmoji"
  },
  "color": "#000000"
}
```

If you want to have manifest.json copied to `dist` for convinence, here's how you can set that up:

Install `rollup-plugin-copy`

```bash
npm i -D rollup-plugin-copy
```

add copy plugin to `rollup.config.ts`

```ts
import copy from "rollup-plugin-copy";

// Add to plugins array
copy({ targets: [{ src: "src/manifest.json", dest: "dist/" }] });
```

After that, when you run `npm run build` your manifest should be copied to `dist` as well as your plugin being built.
