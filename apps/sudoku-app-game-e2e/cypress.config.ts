import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      webServerCommands: {
        default: 'nx run sudoku-app-game:serve:development',
        production: 'nx run sudoku-app-game:serve:production',
      },
      ciWebServerCommand: 'nx run sudoku-app-game:serve-static',
    }),
    baseUrl: 'http://localhost:4200',
  },
});
