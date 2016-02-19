
import npm from 'rollup-plugin-node-resolve';

export default {
  plugins: [
    npm({
      jsnext: true
    })
  ]
}
