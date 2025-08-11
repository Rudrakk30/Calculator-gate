// FULL Scientific Calculator Logic

const buttons = [
    // 1st row
    {display:'sinh', act:'sinh('}, {display:'cosh', act:'cosh('}, {display:'tanh', act:'tanh('}, {display:'Exp', act:'Exp('}, {display:'(', act:'('}, {display:')', act:')'},
    // 2nd row
    {display:'sinh⁻¹', act:'asinh('}, {display:'cosh⁻¹', act:'acosh('}, {display:'tanh⁻¹', act:'atanh('}, {display:'log₂x', act:'log2('}, {display:'ln', act:'ln('}, {display:'log', act:'log10('},
    // 3rd row
    {display:'π', act:'pi'}, {display:'e', act:'e'}, {display:'n!', act:'fact('}, {display:'logyₓ', act:'logyx'}, {display:'eˣ', act:'exp('}, {display:'10ˣ', act:'pow10('},
    // 4th row
    {display:'sin', act:'sin('}, {display:'cos', act:'cos('}, {display:'tan', act:'tan('}, {display:'xʸ', act:'pow'}, {display:'x³', act:'pow3('}, {display:'x²', act:'pow2('},
    // 5th row
    {display:'sin⁻¹', act:'asin('}, {display:'cos⁻¹', act:'acos('}, {display:'tan⁻¹', act:'atan('}, {display:'³√x', act:'cbrt('}, {display:'√x', act:'sqrt('}, {display:'y√x', act:'yroot'},
    // 6th row
    {display:'7', act:'7'}, {display:'8', act:'8'}, {display:'9', act:'9'}, {display:'/', act:'/'}, {display:'%', act:'%'}, {display:'1/x', act:'inv('},
    // 7th row
    {display:'4', act:'4'}, {display:'5', act:'5'}, {display:'6', act:'6'}, {display:'*', act:'*'}, {display:'±', act:'neg'}, {display:'mod', act:'mod'},
    // 8th row
    {display:'1', act:'1'}, {display:'2', act:'2'}, {display:'3', act:'3'}, {display:'-', act:'-'}, {display:'C', act:'C'}, {display:'→', act:'del'},
    // 9th row
    {display:'0', act:'0'}, {display:'.', act:'.'}, {display:'=', act:'='}
];

// Rendering buttons dynamically
function renderButtons() {
    const grid = document.getElementById('button-grid');
    grid.innerHTML = '';
    buttons.forEach((btn, i) => {
        let cl = '';
        if (btn.act === 'C' || btn.act === 'del') cl = 'main-btn';
        if (btn.act === '=') cl = 'eq-btn';
        const b = document.createElement('button');
        b.className = cl;
        b.innerHTML = btn.display;
        b.onclick = () => handleClick(btn.act);
        grid.appendChild(b);
    });
}
renderButtons();

let expr = '';
let angleMode = 'deg';

function setAngleMode(mode) {
    angleMode = mode;
}

// Button handler
function handleClick(act) {
    const exprField = document.getElementById('expression');
    switch(act) {
        case '=':
            try {
                const value = evaluate(expr);
                document.getElementById('result').value = value;
            } catch {
                document.getElementById('result').value = "Error";
            }
            break;
        case 'C':
            expr = '';
            document.getElementById('expression').value = '';
            document.getElementById('result').value = '';
            break;
        case 'del':
            expr = expr.slice(0, -1);
            document.getElementById('expression').value = expr;
            break;
        case 'neg':
            // Toggle negative on last number
            let m = expr.match(/([0-9\.]+)$/);
            if (m) {
                const n = m[1];
                expr = expr.replace(/([0-9\.]+)$/, (-parseFloat(n)).toString());
                exprField.value = expr;
            }
            break;
        case 'yroot':
            expr += 'yroot';
            exprField.value = expr;
            break;
        case 'pow':
            expr += '^';
            exprField.value = expr;
            break;
        case 'mod':
            expr += 'mod';
            exprField.value = expr;
            break;
        case 'logyx':
            expr += 'logyx(';
            exprField.value = expr;
            break;
        default:
            expr += act;
            exprField.value = expr;
            break;
    }
}

// Main evaluation logic
function evaluate(e) {
    // Custom replacements
    if (e.includes('yroot')) {
        // In format: ayrootb = b-th root of a
        let parts = e.split('yroot');
        if (parts.length === 2) {
            let a = parseFloat(parts[0]);
            let b = parseFloat(parts[1]);
            return Math.pow(a, 1/b);
        } else {
            throw new Error();
        }
    }
    if (e.includes('mod')) {
        let parts = e.split('mod');
        if (parts.length === 2) {
            let a = parseFloat(parts[0]);
            let b = parseFloat(parts[1]);
            return a % b;
        } else {
            throw new Error();
        }
    }
    if (e.includes('^')) { // power
        let parts = e.split('^');
        if (parts.length === 2) {
            let a = parseFloat(evaluate(parts[0]));
            let b = parseFloat(evaluate(parts[1]));
            return Math.pow(a, b);
        } else {
            throw new Error();
        }
    }
    // replace constants
    e = e.replace(/pi/g, Math.PI);
    e = e.replace(/e/g, Math.E);
    // Evaluate advanced functions
    // factorial
    e = e.replace(/fact\(([^)]*)\)/g, (m, n) => factorial(parseFloat(n)));
    e = e.replace(/exp\(([^)]*)\)/g, (m, n) => Math.exp(parseFloat(n)));
    e = e.replace(/pow10\(([^)]*)\)/g, (m, n) => Math.pow(10, parseFloat(n)));
    e = e.replace(/pow3\(([^)]*)\)/g, (m, n) => Math.pow(parseFloat(n), 3));
    e = e.replace(/pow2\(([^)]*)\)/g, (m, n) => Math.pow(parseFloat(n), 2));
    e = e.replace(/sqrt\(([^)]*)\)/g, (m, n) => Math.sqrt(parseFloat(n)));
    e = e.replace(/cbrt\(([^)]*)\)/g, (m, n) => Math.cbrt(parseFloat(n)));
    e = e.replace(/inv\(([^)]*)\)/g, (m, n) => 1/parseFloat(n));
    // log
    e = e.replace(/log10\(([^)]*)\)/g, (m, n) => Math.log10(parseFloat(n)));
    e = e.replace(/log2\(([^)]*)\)/g, (m, n) => Math.log2(parseFloat(n)));
    e = e.replace(/ln\(([^)]*)\)/g, (m, n) => Math.log(parseFloat(n)));
    // logyx(a, b) = log base a of b
    e = e.replace(/logyx\(([^,]*)\,([^)]*)\)/g, (m, a, b) => Math.log(parseFloat(b))/Math.log(parseFloat(a)));

    // angle conversion
    function toRad(x) { return angleMode === 'deg' ? x*Math.PI/180 : x;}
    function toDeg(x) { return angleMode === 'deg' ? x*180/Math.PI : x;}
    // Trig functions
    e = e.replace(/sin\(([^)]*)\)/g, (m, n) => Math.sin(toRad(parseFloat(n))));
    e = e.replace(/cos\(([^)]*)\)/g, (m, n) => Math.cos(toRad(parseFloat(n))));
    e = e.replace(/tan\(([^)]*)\)/g, (m, n) => Math.tan(toRad(parseFloat(n))));
    e = e.replace(/asin\(([^)]*)\)/g, (m, n) => toDeg(Math.asin(parseFloat(n))));
    e = e.replace(/acos\(([^)]*)\)/g, (m, n) => toDeg(Math.acos(parseFloat(n))));
    e = e.replace(/atan\(([^)]*)\)/g, (m, n) => toDeg(Math.atan(parseFloat(n))));
    // Hyperbolic
    e = e.replace(/sinh\(([^)]*)\)/g, (m, n) => Math.sinh(parseFloat(n)));
    e = e.replace(/cosh\(([^)]*)\)/g, (m, n) => Math.cosh(parseFloat(n)));
    e = e.replace(/tanh\(([^)]*)\)/g, (m, n) => Math.tanh(parseFloat(n)));
    e = e.replace(/asinh\(([^)]*)\)/g, (m, n) => Math.asinh(parseFloat(n)));
    e = e.replace(/acosh\(([^)]*)\)/g, (m, n) => Math.acosh(parseFloat(n)));
    e = e.replace(/atanh\(([^)]*)\)/g, (m, n) => Math.atanh(parseFloat(n)));

    // Handle logyx(x, y): log base y of x
    e = e.replace(/logyx\(([^)]*)\)/g, (m, rest) => {
        const args = rest.split(',');
        if (args.length === 2)
            return Math.log(parseFloat(args[1])) / Math.log(parseFloat(args[0]));
        else
            throw new Error();
    });

    // Now try to eval simple arithmetic
    if (/[^0-9\.\+\-\*\/\%\(\)]/.test(e)) {
        throw new Error();
    }
    let r = Function('"use strict";return (' + e + ')')();
    return r;
}

function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0) return 1;
    let f = 1;
    for (let i = 1; i <= n; i++) f *= i;
    return f;
}
