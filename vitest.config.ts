import { defineConfig, Plugin } from 'vitest/config';
import fs from 
import path from

  (): Plugin => (
    name: 'angular-component-resource-plugin',
    transform(code: string, id: string) {
      if (!id.endsWith('.ts') || id.endsWith('.spec.ts')) return null;
      if (!code.includes('templateUrl') && !code.includes('styleUrls')) return null;

      const dir = path.dirname(id);
      let transformed = code.replace(/templateUrl:\s*['"](.+?)['"]/g, (match, templateUrl) => {
        const filePath = path.resolve(dir, templateUrl);
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf-8');
          return `template: ${JSON.stringify(content)}`;
        }
        return match;
      });

      transformed = transformed.replace(/styleUrls:\s*\[\s*['"](.+?)['"]\s*\]/g, (match, styleUrl) => {
        const filePath = path.resolve(dir, styleUrl);
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf-8');
          return `styles: [${JSON.stringify(content)}]`;
        }
        return match;
      });

      return { code: transformed, map: null };
    }
  })

export default defineConfig({
  plugins: [angularComponentResourcePlugin()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
  },
});
