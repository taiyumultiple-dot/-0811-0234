import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch:
        process.env.DISABLE_HMR === 'true'
          ? null
          : {
              // 這兩個是伺服器的執行期資料，不是原始碼：
              //   data/db.json  ← server.ts 每次收到 POST /api/state 就會覆寫
              //   uploads/      ← 上傳的頭像
              // 不排除的話會變成無限重載：前端每 3.5 秒 POST 一次狀態 →
              // db.json 變動 → Vite 整頁重載 → 重新掛載後再 POST → 循環不止，
              // 畫面會一直空白。正式站沒有 watcher，所以只有本機開發會中。
              ignored: ['**/data/**', '**/uploads/**'],
            },
    },
  };
});
