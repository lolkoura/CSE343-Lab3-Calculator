// State, calculation logic, DOM rendering, then event handlers.
let current = '0';
let previous = null;
let operator = null;
let fresh = true;
let expression = 'Ready';
const display = document.getElementById('display');
const symbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };
function calculate(a, b, op) {
  if (op === '/' && b === 0) throw new Error('Cannot divide by zero');
  const result = op === '+' ? a + b : op === '-' ? a - b : op === '*' ? a * b : a / b;
  if (!Number.isFinite(result)) throw new Error('Result out of range');
  return Number(result.toPrecision(12));
}
function render() {
  display.textContent = current;
  document.getElementById('expression').textContent = expression;
}
function reset() { current = '0'; previous = null; operator = null; fresh = true; expression = 'Ready'; }
function handleKey(key) {
  if (key === 'clear') reset();
  else if (/^[0-9.]$/.test(key)) {
    if (fresh) { current = key === '.' ? '0.' : key; fresh = false; }
    else if (key !== '.' || !current.includes('.')) current = current === '0' && key !== '.' ? key : current + key;
  } else if (key === 'sign') {
    if (Number.isFinite(Number(current))) current = String(-Number(current));
  } else if (key === 'back') {
    if (!fresh) current = current.slice(0, -1) || '0';
    if (current === '-') current = '0';
  } else if (['+', '-', '*', '/', '='].includes(key) && Number.isFinite(Number(current))) {
    try {
      const operand = Number(current);
      if (operator && previous !== null && !fresh) {
        expression = `${previous} ${symbols[operator]} ${operand} =`;
        current = String(calculate(previous, operand, operator));
      }
      if (key === '=') { operator = null; previous = null; }
      else { previous = Number(current); operator = key; expression = `${current} ${symbols[key]}`; }
      fresh = true;
    } catch (error) { reset(); current = 'Error'; expression = error.message; }
  }
  render();
}
document.getElementById('keys').addEventListener('click', event => {
  const button = event.target.closest('button');
  if (button) handleKey(button.dataset.key);
});
document.addEventListener('keydown', event => {
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  const key = ({Enter: '=', Escape: 'clear', Backspace: 'back'})[event.key] || event.key;
  if (/^[0-9.+*/=\-]$/.test(key) || ['clear', 'back'].includes(key)) {
    event.preventDefault(); handleKey(key);
  }
});
