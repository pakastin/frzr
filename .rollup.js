
import npm from 'rollup-plugin-npm';
import babel from 'rollup-plugin-babel';

export default {
  format: 'umd',
  plugins: [
    babel(),
    npm({
      jsnext: true,
      main: false
    })
  ]
};
