/** @type { import('@storybook/web-components-webpack5').StorybookConfig } */
const config = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.js'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-styling',
    '@storybook/addon-interactions',
    '@storybook/addon-mdx-gfm',
    'storybook-addon-pseudo-states',
  ],
  framework: {
    name: '@storybook/web-components-webpack5',
    options: {},
    staticDirs: ['../public'],
  },
  docs: {
    autodocs: 'tag',
  },
};
export default config;
