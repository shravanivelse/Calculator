import { useState } from 'react'
import './App.css'

function App() {
  const [display, setDisplay] = useState('0')
  const [prevValue, setPrevValue] = useState(null)
  const [operator, setOperator] = useState(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [memory, setMemory] = useState(null)
  const [history, setHistory] = useState([])

  const isNumber = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value)
  }

  const formatNumber = (number) => {
    const stringNum = number.toString()
    if (stringNum.length > 12) {
      return Number(number).toExponential(8)
    }
    return stringNum
  }

  const handleNumber = (number) => {
    if (waitingForOperand) {
      setDisplay(String(number))
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? String(number) : display + number)
    }
  }

  const handleDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.')
    }
  }

  const handleOperator = (nextOperator) => {
    const inputValue = parseFloat(display)

    if (prevValue === null) {
      setPrevValue(inputValue)
    } else if (operator) {
      const result = calculate(prevValue, inputValue, operator)
      setDisplay(formatNumber(result))
      setPrevValue(result)
      
      // Add to history
      setHistory(prev => [...prev, `${prevValue} ${operator} ${inputValue} = ${result}`])
    }

    setWaitingForOperand(true)
    setOperator(nextOperator)
  }

  const calculate = (prevValue, nextValue, operator) => {
    switch (operator) {
      case '+':
        return prevValue + nextValue
      case '-':
        return prevValue - nextValue
      case '*':
        return prevValue * nextValue
      case '/':
        if (nextValue === 0) return 'Error'
        return prevValue / nextValue
      case '^':
        return Math.pow(prevValue, nextValue)
      default:
        return nextValue
    }
  }

  const handleEqual = () => {
    const inputValue = parseFloat(display)
    if (prevValue === null) return

    const result = calculate(prevValue, inputValue, operator)
    if (result === 'Error') {
      setDisplay('Error')
    } else {
      setDisplay(formatNumber(result))
      // Add to history
      setHistory(prev => [...prev, `${prevValue} ${operator} ${inputValue} = ${result}`])
    }
    setPrevValue(null)
    setOperator(null)
    setWaitingForOperand(true)
  }

  const handleClear = () => {
    setDisplay('0')
    setPrevValue(null)
    setOperator(null)
    setWaitingForOperand(false)
    setMemory(null)
  }

  const handleAllClear = () => {
    handleClear()
    setHistory([])
  }

  const factorial = (n) => {
    if (!Number.isInteger(n) || n < 0) return 'Error'
    if (n === 0 || n === 1) return 1
    let result = 1
    for (let i = 2; i <= n; i++) {
      result *= i
      if (!isFinite(result)) return 'Error'
    }
    return result
  }

  const handleScientific = (operation) => {
    const currentValue = parseFloat(display)
    if (!isNumber(currentValue) && operation !== 'pi') return

    let result
    let expression = ''
    
    try {
      switch (operation) {
        case 'sin':
          result = Math.sin((currentValue * Math.PI) / 180)
          expression = `sin(${currentValue}°)`
          break
        case 'cos':
          result = Math.cos((currentValue * Math.PI) / 180)
          expression = `cos(${currentValue}°)`
          break
        case 'tan':
          result = Math.tan((currentValue * Math.PI) / 180)
          expression = `tan(${currentValue}°)`
          break
        case 'factorial':
          result = factorial(Math.round(currentValue))
          expression = `${currentValue}!`
          break
        case 'square':
          result = currentValue * currentValue
          expression = `${currentValue}²`
          break
        case 'cube':
          result = currentValue * currentValue * currentValue
          expression = `${currentValue}³`
          break
        case 'sqrt':
          result = currentValue < 0 ? 'Error' : Math.sqrt(currentValue)
          expression = `√${currentValue}`
          break
        case 'cbrt':
          result = Math.cbrt(currentValue)
          expression = `∛${currentValue}`
          break
        case 'pi':
          result = Math.PI
          expression = 'π'
          break
        case 'log':
          result = currentValue <= 0 ? 'Error' : Math.log10(currentValue)
          expression = `log(${currentValue})`
          break
        case 'ln':
          result = currentValue <= 0 ? 'Error' : Math.log(currentValue)
          expression = `ln(${currentValue})`
          break
        case 'exp':
          result = Math.exp(currentValue)
          expression = `e^${currentValue}`
          break
        default:
          return
      }

      if (result === 'Error' || !isFinite(result)) {
        setDisplay('Error')
      } else {
        setDisplay(formatNumber(result))
        // Add to history
        setHistory(prev => [...prev, `${expression} = ${formatNumber(result)}`])
      }
      setWaitingForOperand(true)
    } catch (error) {
      setDisplay('Error')
      setWaitingForOperand(true)
    }
  }

  const handleMemory = (operation) => {
    const currentValue = parseFloat(display)
    switch (operation) {
      case 'MS':
        setMemory(currentValue)
        setWaitingForOperand(true)
        break
      case 'MR':
        if (memory !== null) {
          setDisplay(String(memory))
          setWaitingForOperand(true)
        }
        break
      case 'MC':
        setMemory(null)
        break
      case 'M+':
        setMemory((prev) => (prev || 0) + currentValue)
        setWaitingForOperand(true)
        break
      case 'M-':
        setMemory((prev) => (prev || 0) - currentValue)
        setWaitingForOperand(true)
        break
    }
  }

  return (
    <div className="calculator-container">
      <div className="calculator">
        <div className="history">
          {history.slice(-3).map((entry, index) => (
            <div key={index} className="history-entry">{entry}</div>
          ))}
        </div>
        <div className="display">{display}</div>
        
        <div className="scientific-buttons">
          <button onClick={() => handleScientific('sin')}>sin</button>
          <button onClick={() => handleScientific('cos')}>cos</button>
          <button onClick={() => handleScientific('tan')}>tan</button>
          <button onClick={() => handleScientific('factorial')}>x!</button>
          <button onClick={() => handleScientific('square')}>x²</button>
          <button onClick={() => handleScientific('cube')}>x³</button>
          <button onClick={() => handleScientific('sqrt')}>√</button>
          <button onClick={() => handleScientific('cbrt')}>∛</button>
          <button onClick={() => handleScientific('pi')}>π</button>
          <button onClick={() => handleScientific('log')}>log</button>
          <button onClick={() => handleScientific('ln')}>ln</button>
          <button onClick={() => handleScientific('exp')}>exp</button>
        </div>

        <div className="memory-buttons">
          <button onClick={() => handleMemory('MC')}>MC</button>
          <button onClick={() => handleMemory('MR')}>MR</button>
          <button onClick={() => handleMemory('MS')}>MS</button>
          <button onClick={() => handleMemory('M+')}>M+</button>
          <button onClick={() => handleMemory('M-')}>M-</button>
        </div>

        <div className="keypad">
          <div className="numbers">
            {[7, 8, 9, 4, 5, 6, 1, 2, 3, 0].map((num) => (
              <button key={num} onClick={() => handleNumber(num)}>
                {num}
              </button>
            ))}
            <button onClick={handleDecimal}>.</button>
            <button onClick={() => handleNumber('00')}>00</button>
          </div>

          <div className="operators">
            <button onClick={() => handleOperator('+')}>+</button>
            <button onClick={() => handleOperator('-')}>−</button>
            <button onClick={() => handleOperator('*')}>×</button>
            <button onClick={() => handleOperator('/')}>÷</button>
            <button onClick={() => handleOperator('^')}>xʸ</button>
            <button onClick={handleEqual}>=</button>
            <button onClick={handleClear}>C</button>
            <button onClick={handleAllClear}>AC</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App