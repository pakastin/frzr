var $code = document.getElementById('code');
var $lineNumbers = document.createElement('pre');

var $lines = $code.querySelector('pre');
var lines = $lines.textContent.split('\n');
var digits = ('' + lines.length).length;
var zeros = '';

$lines.style.paddingLeft = (1 + digits / 2) + 'rem';
$lineNumbers.className = 'linenumbers';

for (var i = 0; i < digits; i++) {
  zeros += '0';
}

for (var i = 0; i < lines.length; i++) {
  $lineNumbers.textContent += (zeros + i).slice(-digits) + '\n';
}
$code.insertBefore($lineNumbers, $code.firstChild);
