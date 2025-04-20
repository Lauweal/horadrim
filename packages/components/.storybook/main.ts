import type { StorybookConfig } from '@storybook/react-vite';
import { merge } from 'lodash';
import { viteImportPlugin } from '../../../plugins/import-plugin/src';
import path from 'path';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-essentials",
    "@storybook/addon-viewport",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions"
  ],
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  },
  viteFinal: async (config) => {

    return merge(config, {
      plugins: [
        ...config.plugins || [],
        viteImportPlugin({
        libraryName: '@horadrim/components',
        libraryDirectory: 'src',
        style: 'less'
      })],
      resolve: {
        alias: {
          '@horadrim/components': path.resolve(__dirname, '..'),
          '@horadrim/theme': path.resolve(__dirname, '../../theme')
        }
      }
    });
  }
};
export default config;