import { resolve } from 'path';
import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: [
    'src/index',
    {
      input: 'src/expands/index',
      name: 'expands',
    },
    {
      input: 'src/plugins/index',
      name: 'plugins',
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
