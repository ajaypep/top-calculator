const display = document.querySelector('#display');
const SYNTAX_ERROR_MSG = 'ERROR';
let syntaxErrorOcurred = false;
let num1 = null;
let operator = null;
let num2 = null;
let operatorWasClicked = false;
let equalsWasClicked = false;
let resultIsSet = false;

function isFloatingPointNumber(num) {
    return Math.floor(num) !== Number(num);
}

function isLongNumber(num) {
    return num.toString().length > 9;
}

function operate(a, op, b) {
    a = Number(a);
    b = Number(b);
    let result = null;
    switch (op) {
        case '+': result = a + b; break;
        case '-': result = a - b; break;
        case '*': result = a * b; break;
        case '/': result = a / b; break;
        default: return null;
    }
    if (isLongNumber(result)) {
        return result.toExponential(4);
    }
    return result;
};

function handleNumButtons() {
    const numButtons = document.querySelectorAll('.num');
    numButtons.forEach(btn => btn.addEventListener(
        'click',
        () => {
            if (syntaxErrorOcurred) clearAll();
            if (display.textContent.length >= 9) {
                if (!operatorWasClicked || (operatorWasClicked && num2 !== null)) {
                    alert('Length of number must be less than 6 characters');
                    return;
                }
            }
            if (equalsWasClicked) {
                clearAll();
                equalsWasClicked = false;
            }
            let displayText = display.textContent === '0' ?
                btn.textContent : display.textContent.concat(btn.textContent);
            if (!operatorWasClicked) {
                num1 = displayText;
            } else {
                if (num2 === null) {
                    clearDisplay();
                    displayText = btn.textContent;
                }
                num2 = displayText;
            }
            display.textContent = displayText;
        }
    ));
}

function disablePointButton() {
    const pointBtn = document.getElementById('point');
    pointBtn.style.boxShadow = 'none';
    pointBtn.style.opacity = '0.3';
    pointBtn.style.cursor = 'not-allowed';
    pointBtn.disabled = true;
}
function enablePointButton() {
    const pointBtn = document.getElementById('point');
    pointBtn.style.boxShadow = '2px 2px 5px black';
    pointBtn.style.opacity = '1';
    pointBtn.style.cursor = 'pointer';
    pointBtn.disabled = false;
}

function handlePointButton() {
    const pointBtn = document.getElementById('point');
    pointBtn.addEventListener(
        'click',
        () => {
            display.textContent += '.';
            disablePointButton();
        }
    )
}

function clearDisplay() {
    syntaxErrorOcurred = false;
    display.textContent = 0;
    enablePointButton();
}

function clearAll() {
    clearDisplay();
    num1 = null;
    num2 = null;
    operatorWasClicked = false;
}

function handleAllClearButton() {
    const clearButton = document.getElementById('clear-btn');
    clearButton.addEventListener(
        'click',
        clearAll
    );
}

function setResult() {
    num1 = operate(num1, operator, num2);
    display.textContent = num1;
    num2 = null;
}

function handleDeleteButton() {
    const deleteButton = document.getElementById('delete');
    deleteButton.addEventListener(
        'click',
        () => {
            if (display.textContent == '0' || equalsWasClicked) return;
            else if (!operatorWasClicked || (operatorWasClicked && num2 !== null)) {
                if (display.textContent.length === 1) {
                    display.textContent = 0;
                } else {
                    display.textContent = display.textContent.slice(0, -1);
                }
            }
            if (!operatorWasClicked) {
                num1 = display.textContent;
            } else {
                num2 = display.textContent;
            }
        }
    )
}

function handleDivideByZero() {
    alert('OI!, you can\'t divide by zero');
}

function handleOperatorButton() {
    const operators = document.querySelectorAll('.operator');
    operators.forEach(op => op.addEventListener(
        'click',
        () => {
            if (!operatorWasClicked) {
                operatorWasClicked = true;
                equalsWasClicked = false;
            } else {
                if (num2 === null) return;
                if (num2 === 0 && operator === '/') {
                    handleDivideByZero();
                    clearAll();
                    return;
                }
                setResult();
            }
            operator = op.textContent;
        }
    ));
}

function handleEqualsButton() {
    const equalsButton = document.getElementById('equals-btn');
    equalsButton.addEventListener(
        'click',
        () => {
            if (num2 === null && operatorWasClicked) {
                clearDisplay();
                syntaxErrorOcurred = true;
                display.textContent = SYNTAX_ERROR_MSG;
            }
            if (num2 === null) return;
            if (num2 === 0 && operator === '/') {
                handleDivideByZero();
                clearAll();
                return;
            }
            setResult();
            operatorWasClicked = false;
            equalsWasClicked = true;
        }
    );
}

function isNumber(x) {
    return !isNaN(Number.parseInt(x));
}

function isOperatorOrPoint(x) {
    const operators = ['+', '-', '*', '/'];
    return operators.includes(x) || x === '.';
}

function isValidActionKey(x) {
    const validActionKeys = ['Backspace', 'Enter', '='];
    return validActionKeys.includes(x);
}

function isValidInput(x) {
    return isNumber(x) || isOperatorOrPoint(x) || isValidActionKey(x);
}

function handleKeys() {
    document.addEventListener(
        'keydown',
        (e) => {
            if (!isValidInput(e.key)) return;
        }
    )
}

handleNumButtons();
handleDeleteButton();
handleAllClearButton();
handleOperatorButton();
handleEqualsButton();
handlePointButton();