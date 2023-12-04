module.exports = {
  packagerConfig: {
    ignore: [
      /^\/src/,
      /^\/\..+/,
      /(tsconfig.*)|(electron.vite.config.ts)|(forge.config.cjs)|(tailwind.config.js)|(postcss.config.js)/,
      'README.md',
      'nodemon.json',
    ],
    icon: './build/icon'
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
}