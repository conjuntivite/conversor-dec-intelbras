// Formato Intelbras (leitores faciais): hex de 8 dígitos com a ordem dos bytes invertida (little-endian).
// Ex.: 456566197 -> padrão 1B36A5B5 -> Intelbras B5A5361B
const MAX = 0xFFFFFFFF;

function lerDec(texto) {
  const s = String(texto).trim();
  if (!/^\d+$/.test(s)) throw new Error('Digite apenas números (0 a 9).');
  const n = Number(s);
  if (n > MAX) throw new Error('O código deve ser no máximo 4294967295.');
  return n;
}

// Aceita "0x", espaços e minúsculas: "b5 a5 36 1b" -> "B5A5361B"
function lerHex(texto) {
  const s = String(texto).replace(/\s+/g, '').replace(/^0x/i, '').toUpperCase();
  if (!/^[0-9A-F]+$/.test(s)) throw new Error('Digite apenas 0–9 e A–F.');
  if (s.replace(/^0+/, '').length > 8) throw new Error('O hex deve ter no máximo 8 dígitos (FFFFFFFF).');
  return s;
}

const inverterBytes = (hex8) => hex8.match(/../g).reverse().join('');

function decParaHex(texto) {
  return lerDec(texto).toString(16).toUpperCase();
}

function decParaIntelbras(texto) {
  return inverterBytes(decParaHex(texto).padStart(8, '0'));
}

function hexParaDec(texto) {
  return String(parseInt(lerHex(texto), 16));
}

// Intelbras sempre tem 8 dígitos; com menos, não dá para saber onde ficam os bytes.
function intelbrasParaDec(texto) {
  const s = lerHex(texto);
  if (s.length !== 8) throw new Error('O formato Intelbras tem exatamente 8 dígitos.');
  return String(parseInt(inverterBytes(s), 16));
}

if (typeof module !== 'undefined') {
  // Auto-teste: node conversor.js
  const assert = require('assert');
  assert.strictEqual(decParaIntelbras('456566197'), 'B5A5361B');
  assert.strictEqual(decParaIntelbras('2779534132'), '3453ACA5');
  assert.strictEqual(decParaIntelbras('1'), '01000000');
  assert.strictEqual(decParaHex('456566197'), '1B36A5B5');
  assert.strictEqual(decParaHex('255'), 'FF');
  assert.strictEqual(hexParaDec('1B36A5B5'), '456566197');
  assert.strictEqual(hexParaDec('0xff'), '255');
  assert.strictEqual(hexParaDec('FFFFFFFF'), '4294967295');
  assert.strictEqual(intelbrasParaDec('B5A5361B'), '456566197');
  assert.strictEqual(intelbrasParaDec('34 53 ac a5'), '2779534132');
  assert.strictEqual(intelbrasParaDec(decParaIntelbras('2876553983')), '2876553983');
  assert.throws(() => decParaIntelbras('12a'));
  assert.throws(() => decParaIntelbras('4294967296'));
  assert.throws(() => hexParaDec('XYZ'));
  assert.throws(() => hexParaDec('1FFFFFFFF'));
  assert.throws(() => intelbrasParaDec('FF'));
  console.log('ok');
}
