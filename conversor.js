// Decimal -> hex de 8 dígitos com a ordem dos bytes invertida (little-endian), formato usado nos leitores faciais Intelbras.
// Ex.: 456566197 -> 1B36A5B5 -> B5A5361B
function decParaIntelbras(texto) {
  const s = String(texto).trim();
  if (!/^\d+$/.test(s)) throw new Error('Digite apenas números (0 a 9).');
  const n = Number(s);
  if (n > 0xFFFFFFFF) throw new Error('O código deve ser no máximo 4294967295.');
  return n.toString(16).toUpperCase().padStart(8, '0').match(/../g).reverse().join('');
}

if (typeof module !== 'undefined') {
  // Auto-teste: node conversor.js
  const assert = require('assert');
  assert.strictEqual(decParaIntelbras('456566197'), 'B5A5361B');
  assert.strictEqual(decParaIntelbras('2779534132'), '3453ACA5');
  assert.strictEqual(decParaIntelbras('1'), '01000000');
  assert.throws(() => decParaIntelbras('12a'));
  assert.throws(() => decParaIntelbras('4294967296'));
  console.log('ok');
}
