import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'elevator_app.js',
  output: {
    file: 'elevator_bundle.js',
    format: 'cjs',
  },
  plugins: [
    nodeResolve({
      jsnext: true,
      module: true,
    }),
    commonjs({
      include: 'node_modules/**',
    }),
  ],
};
