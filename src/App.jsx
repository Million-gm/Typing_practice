import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [time, setTime] = useState(0)
  const [typedText, setTypedText] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [endTime, setEndTime] = useState(null)
  const [intervalId, setIntervalId] = useState(null)
  const [wpm, setWPM] = useState(0)
  const [accuracy, setAccuracy] = useState(0)
  const [totalTyped, setTotalTyped] = useState(0)
  const [correctTyped, setCorrectTyped] = useState(0)
  const [incorrectTyped, setIncorrectTyped] = useState(0)
  const [selectedLevel, setSelectedLevel] = useState("easy")
  const [isFinished, setIsFinished] = useState(false)

  const hardLevelTexts= [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies lacinia, nunc nisl aliquam nisl, eget aliquam nunc nisl eget nunc. Donec auctor, nisl eget ultricies lacinia, nunc nisl aliquam nisl, eget aliquam nunc nisl eget nunc.",
    "The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.",
    "Typing is a skill that can be improved with practice. The more you type, the faster and more accurate you will become. Keep practicing to see your progress!"
  ]
  const midLevelTexts = [
    "The cat is on the roof. The cat is on the roof. The cat is on the roof.",
    "I love programming. I love programming. I love programming.",
    "Practice makes perfect. Practice makes perfect. Practice makes perfect."
  ]
  const easyLevelTexts = [
    "Hello world. Hello world. Hello world.",
    "I am learning to type. I am learning to type. I am learning to type.",
    "Typing is fun. Typing is fun. Typing is fun."
  ]
  const [text, setText] = useState(selectedLevel === "easy" ? easyLevelTexts[Math.floor(Math.random() * 3)] : selectedLevel === "medium" ? midLevelTexts[Math.floor(Math.random() * 3)] : hardLevelTexts[Math.floor(Math.random() * 3)])

  const calculateWPM = () => {
    if (typedText.length === 0) return 0;
    const minutes = time / 60;
    const words = text.trim().split(/\s+/).length;
    return Math.round(words / minutes);
  };
function colorText(){
  if(text.length === 0) return "";
  const coloredText = text.split("").map((char, index) => {
    if (index < typedText.length) {
      if (char === typedText[index]) {
        return <span key={index} style={{ color: "green" }}>{char}</span>;
      } else {
        return <span key={index} style={{ color: "red" }}>{char}</span>;
      }
    } else {
      return <span key={index}>{char}</span>;
    }
  });
  return coloredText;
}
function calculateAccuracy() {
  if (totalTyped === 0) return 0;
  return Math.round((correctTyped / totalTyped) * 100);
}
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}
function handleTyping(e) {
  const value = e.target.value;
  setTypedText(value);
  setTotalTyped(value.length);
  let correct = 0;
  for (let i = 0; i < value.length; i++) {
    if (value[i] === text[i]) {
      correct++;
    }
  }
  setCorrectTyped(correct);
  setIncorrectTyped(value.length - correct);
  setAccuracy(calculateAccuracy());
  setWPM(calculateWPM());
}
function handleStop() {
  setIsRunning(false);
  if (intervalId) {
    clearInterval(intervalId);
    setIntervalId(null);
  }
  setEndTime(Date.now());
  setWPM(calculateWPM());
  setAccuracy(calculateAccuracy());
  setIsFinished(true);
}
function handleStart() {
  // handleStop();
  setIsRunning(true);
  setStartTime(Date.now());
  // const id = setInterval(() => {
  //   setTime(Math.floor((Date.now() - startTime) / 1000));
  // }, 1000);
  // setIntervalId(id);
  
  setIsFinished(false);
}
useEffect(() => {
    if (isRunning) {
      const id = setInterval(() => {
        setTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      setIntervalId(id);
    } else if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    };
  }, [isRunning, startTime]);
function handleReset() {  setTime(0);
  setTypedText("");
  setIsRunning(false);
  setStartTime(null);
  setEndTime(null);
  if (intervalId) {
    clearInterval(intervalId);
    setIntervalId(null);
  }
  setWPM(0);
  setAccuracy(0);
  setTotalTyped(0);
  setCorrectTyped(0);
  setIncorrectTyped(0);
  setIsFinished(false);
}
function handleLevelChange(e) {
  const level = e.target.value;
  setSelectedLevel(level);
  if (level === "easy") {
    setText(easyLevelTexts[Math.floor(Math.random() * 3)]);
  } else if (level === "medium") {
    setText(midLevelTexts[Math.floor(Math.random() * 3)]);
  } else if (level === "hard") {
    setText(hardLevelTexts[Math.floor(Math.random() * 3)]);
  }
  handleReset();
}

  return (
    <>
      <div className="App">
        <div className="result_bar">
          <p>WPM: {wpm}</p>
          <p>Accuracy: {accuracy}%</p>
          <p>Time counter: {formatTime(time)}s</p>
          <div className="level_select">
          <label htmlFor="level-select">Choose a level:</label>
          <select name="level" id="level-select" onChange={handleLevelChange} value={selectedLevel}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
</div>
        </div>
        <div className="Typing_area">
          <div className="typing_to_write">
            <p>Type the following text:</p>
              {/* <p>{hardLevelTexts[Math.floor(Math.random() * 3)]}</p> */}
                {/* <p>{text}</p> */}
                <div className='targetText'>          
                  <p >{colorText()}</p>
              </div>
            </div>
            <div className="typing_area_text">
            <textarea 
              className="typing_area_text" 
              placeholder="Start typing here..." 
              value={typedText}
              onChange={handleTyping}
              onKeyDown={(e) => {
                if (!isRunning) {
                  //setIsRunning(true);
                  // setStartTime(Date.now());
                  // const id = setInterval(() => {
                  //   setTime(Math.floor((Date.now() - startTime) / 1000));
                  // }, 1000);
                  // setIntervalId(id);
                  handleStart();
                }
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
            ></textarea>
              {isRunning && (
                <button className="btn stop_btn" onClick={handleStop}>
                  Stop
                </button>
              )}
             {!isRunning && (
                <button className="btn start_btn" onClick={handleStart}>
                  Start
                </button>
              )}
              <button className="btn" onClick={handleReset}>Reset</button>
            
          </div>
        </div>
      </div>
    </>
  )
}

export default App
