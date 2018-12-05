import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import svelte from 'rollup-plugin-svelte';

import postcss from 'postcss';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/index.js',
  output: {
    sourcemap: true,
    format: 'es',
    file: 'public/index.js',
  },
  plugins: [
    nodeResolve({
      jsnext: true,
      browser: true,
    }),
    commonjs(),
    svelte({
      dev: !production,
      skipIntroByDefault: true,
      nestedTransitions: true,
      customElement: true,
      preprocess: {
        style: ({ content, attributes }) => {
          if (attributes.type !== 'text/postcss') {
            return;
          }

          const plugins = [require('postcss-nested')];

          return postcss(plugins)
            .process(content, {
              from: 'src',
              map: { inline: false },
            })
            .then(({ css, map }) => ({
              code: css.toString(),
              map: map.toString(),
            }));
        },
      },
    }),
  ],
};
