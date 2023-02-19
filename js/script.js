class Calculator {
    constructor(lastOperation, result) {
        this.lastOperation = lastOperation;
        this.result = result;
    }

    sum = (num1, num2) => {
        return Number(num1) + Number(num2);
    }
    
    subtract = (num1, num2) => {
        return Number(num1) - Number(num2);
    }
    
    multiply = (num1, num2) => {
        return Number(num1) * Number(num2);
    }
    
    divide = (num1, num2) => {
        if(num1 != 0 && num2 == 0) {
            return 'Não é possível dividir por zero!';
        }
        if(num1 == 0 && num2 == 0) {
            return 'Resultado indefinido!';
        }
        return Number(num1) / Number(num2);
    }

    identifiesOperation = lastOperation => {
        const lastOperator = lastOperation.match(/.*([/*+-])/);
        const signal = lastOperator[lastOperator.length - 1];
        const signalPosition = lastOperation.lastIndexOf(signal);
        const leftValue = lastOperation.slice(0, signalPosition);
        const rightValue = lastOperation.slice(signalPosition + 1);
        
        switch(signal) {
            case '/':
                return this.divide(leftValue, rightValue);
            case '*':
                return this.multiply(leftValue, rightValue);
            case '+':
                return this.sum(leftValue, rightValue);
            case '-':
                return this.subtract(leftValue, rightValue);
        }
    }

    cleanAll = () => {
        lastOperation.innerText = '';
        result.innerText = '0';
        clikedEqualsButton = false;
        clikedOperatorButton = false;
    }

    backspace = () => {
        if (clikedEqualsButton) {
            return;
        }

        if (lastOperation.innerText.length <= 1 || /^-\d$/.test(lastOperation.innerText)) {
            lastOperation.innerText = '';
            result.innerText = '0';
        } else {
            if (/^\d$/.test(lastOperation.innerText.slice(-1)) || lastOperation.innerText.slice(-1) == '.') {
                if (result.innerText.length <= 1) {
                    result.innerText = '0';
                } else {
                    result.innerText = result.innerText.slice(0, -1);
                }
            }
            lastOperation.innerText = lastOperation.innerText.slice(0, -1);
            if (/^[+-]?\d{1,}(?:\.\d{1,})?$/.test(lastOperation.innerText)) {
                result.innerText = lastOperation.innerText;
            }
        }
    }

    calculatesPercentage = () => {
        const hasNumber = lastOperation.innerText.match(/(?:(\d{1,})|(\d{1,}\.\d{1,}))$/);

        if(hasNumber !== null && !clikedEqualsButton) {
            const percentage = hasNumber[0] / 100;
            const newOperation = lastOperation.innerText.slice(0, hasNumber.index) + percentage;
            lastOperation.innerText = newOperation;
            result.innerText = percentage;
        }
    }

    changeSign = () => {
        const lastCharacter = lastOperation.innerText.slice(-1);
        const additionSubtractionOperators = ['+', '-'];

        if (additionSubtractionOperators.includes(lastCharacter)) {
            if (lastCharacter == '+') {
                lastOperation.innerText = lastOperation.innerText.slice(0, -1) + '-';
            } else {
                if (lastCharacter == '-') {
                    lastOperation.innerText = lastOperation.innerText.slice(0, -1) + '+';
                }
            }
        } else {
            if (result.innerText == '0' && lastOperation.innerText == '') return;

            const operatorPositionPlus = lastOperation.innerText.lastIndexOf('+');
            const minusOperatorPosition = lastOperation.innerText.lastIndexOf('-');
            const hasNumber = /^[+-]?\d{1,}\.?\d{0,}/.test(lastOperation.innerText);

            if (!/[/*](?:(\d{1,})|(\d{1,}\.\d{1,}))$/.test(lastOperation.innerText)) {
                if (/\d{1,}/.test(lastCharacter)) {
                    if (!clikedEqualsButton && hasNumber) {
                        if (operatorPositionPlus > minusOperatorPosition) {
                            const leftValue = lastOperation.innerText.slice(0, operatorPositionPlus);
                            const rightValue = lastOperation.innerText.slice(operatorPositionPlus + 1);
                            lastOperation.innerText = leftValue + '-' + rightValue;
                        } else {
                            if (operatorPositionPlus < minusOperatorPosition) {
                                if (/^-\d{1,}\.?\d{0,}$/.test(lastOperation.innerText)) {
                                    lastOperation.innerText = lastOperation.innerText.slice(1);
                                    result.innerText = lastOperation.innerText;
                                    return;
                                } else {
                                    const leftValue = lastOperation.innerText.slice(0, minusOperatorPosition);
                                    const rightValue = lastOperation.innerText.slice(minusOperatorPosition + 1);
                                    lastOperation.innerText = leftValue + '+' + rightValue;
                                }
                            } else {
                                lastOperation.innerText = '-' + lastOperation.innerText;
                                result.innerText = lastOperation.innerText;
                            }
                        }
                    }
                }
            }
        }
    }

    deleteLastCharacter = () => {
        const expectedRegexPattern = /(^-?\d+(?:\.)?$)|(^-?\d+(?:\.\d+)?$)|(^-?\d+(?:\.\d+)?[/*+-]$)|(^-?\d+(?:\.\d+)?[/*+-]\d+(?:\.)?$)|(^-?\d+(?:\.\d+)?[/*+-]\d+(?:\.\d+)?$)/.test(lastOperation.innerText);

        if (!expectedRegexPattern) {
            lastOperation.innerText = lastOperation.innerText.slice(0, -1);
        }
    }

    calculate = (input, opetators) => {
        const hasFullOperation = /^-?\d+(?:\.\d+)?[/*+-]\d+(?:\.\d+)?$/.test(lastOperation.innerText);
    
        if (hasFullOperation) {
            if (opetators.includes(input)) {
                result.innerText = this.identifiesOperation(lastOperation.innerText);
                lastOperation.innerText = result.innerText + input;
                clikedOperatorButton = true;
            } else {
                if (input == '=') {
                    result.innerText = this.identifiesOperation(lastOperation.innerText);
                    clikedEqualsButton = true;
                }
            }
        }
    }

    start = event => {

        let input;

        if(event.code === undefined) {
            if (event.target.closest('[data-btn-value]') === null) return;
            
            input = event.target.closest('[data-btn-value]').dataset.btnValue || event.target.dataset.btnValue;
            event.target.closest('button').blur();
        } else {
            const keys = ['%', 'Delete', 'Backspace', 'Enter', ',', '/', '+', '-', '*', '=', '.', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
            
            if(!keys.includes(event.key)) return;

            switch(event.key) {
                case 'Enter':
                    input = '=';
                    break;
                case ',':
                    input = '.';
                    break;
                default:
                    input = event.key;
                    break;
            }
        }
        
        const opetators = ['/', '*', '-', '+'];
    
        if (input == 'Delete') {
            this.cleanAll();
            return;
        }
    
        if (opetators.includes(input) && opetators.includes(lastOperation.innerText.slice(-1))) {
            lastOperation.innerText = lastOperation.innerText.slice(0, -1) + input;
            return;
        }
    
        if (input == 'Backspace') {
            this.backspace();
            return;
        }
    
        if (opetators.includes(input) && result.innerText == '0') {
            lastOperation.innerText = '0' + input;
            return;
        }
    
        if (input == '.' && opetators.includes(lastOperation.innerText.slice(-1))) {
            return;
        } else {
            if (input == '.' && lastOperation.innerText == '') {
                lastOperation.innerText = '0.';
                result.innerText = '0.';
                return;
            }
        }
    
        if(input == '%') {
            this.calculatesPercentage();
            return;
        }

        if (input == '+/-') {
            this.changeSign();
            return;
        }
    
        if (/^\d$/.test(input) || input == '.') {
            if ((result.innerText == '0' || opetators.includes(lastOperation.innerText.slice(-1))) && input != '.') {
                result.innerText = input;
            } else {
                if (!clikedEqualsButton) {
                    const hasDot = /\./.test(result.innerText);
    
                    if (hasDot && input == '.') return;
    
                    result.innerText += input;    
                } else {
                    if (input != '.') {
                        result.innerText = input;
                    } else {
                        return;
                    }
                }
            }
        }

        if (clikedOperatorButton) {
            if (/^\d$/.test(input) || input == '.') {
                if (lastOperation.innerText == '0') {
                    lastOperation.innerText = input;
                } else {
                    lastOperation.innerText += input;
                }
            }
            clikedOperatorButton = false;
        } else {
            if (clikedEqualsButton) {
                if (/^\d$/.test(input) || input == '.') {
                    lastOperation.innerText = input;
                } else {
                    lastOperation.innerText = result.innerText + input;
                }
                clikedEqualsButton = false;
            } else {
                if (lastOperation.innerText == '0') {
                    if (input == '.') {
                        lastOperation.innerText += input;
                        return;
                    } else {
                        lastOperation.innerText = input;
                    }
                } else {
                    if (/[/*+-]0$/.test(lastOperation.innerText) && input == '0') return;
                    
                    if (/[/*+-]0$/.test(lastOperation.innerText) && /[1-9]/.test(input)) {
                        lastOperation.innerText = lastOperation.innerText.slice(0, -1) + input;
                    } else {
                        lastOperation.innerText += input;
                    }
                }
            }
        }

        this.deleteLastCharacter();
        this.calculate(input, opetators);
    }
}

let clikedEqualsButton = false;
let clikedOperatorButton = false;

const lastOperation = document.querySelector('.last-operation');
const result = document.querySelector('.result');

const calculator = new Calculator(lastOperation, result);

document.querySelector('.buttons').addEventListener('click', calculator.start);
document.body.addEventListener('keyup', calculator.start);