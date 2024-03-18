import { resolve } from 'path';
import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: [
    'src/index',
    {
      input: 'src/expand/index',
      name: 'expand',
    },
    {
      input: 'src/plugin/index',
      name: 'plugin',
    }
  ],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
  },
  alias: {
    '@': resolve('./src/'),
  },
});
