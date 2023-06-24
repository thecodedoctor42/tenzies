import React from "react"
import Confetti from "react-confetti"
import {nanoid} from "nanoid"
import Die from "./components/Die"
import Timer from "./components/Timer"

export default function App() {
    const [rolls, setRolls] = React.useState(10)
    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [countdownStarted, setCountdownStarted] = React.useState(false)

    // Using two pieces of state in sync is a good call
    // for useEffect.
    React.useEffect(() => {
        const firstValue = dice[0].value
        // .every() tests whether all elements in an array pass
        // the test implemented by the provided function
        // (returns boolean)
        const allHeld = dice.every(die => die.held)
        const allSameNumber = dice.every(die => die.value === firstValue)
        if(allHeld && allSameNumber) {
            setTenzies(true)
        }
    }, [dice])

    function startCountdown(){
      setCountdownStarted(true)
    }

    function randomDieValue() {
        return Math.ceil(Math.random() * 6)
    }

    function allNewDice() {
        const newArray = []
        for(let i = 0; i < 10; i++) {
            const newDie = {
                value: randomDieValue(),
                held: false,
                id: nanoid()
            }
            newArray.push(newDie)
        }
        return newArray
    }

    function rollUnheldDice() {
        if (!tenzies) {
            setDice((oldDice) => oldDice.map((die) =>
                die.held ? 
                    die : 
                    { value: randomDieValue(), held: false, id: nanoid() }
            ))
            setRolls(oldRolls => oldRolls + dice.filter(die => die.held === false).length)
        } else {
            if (localStorage.getItem("bestRolls")){
              rolls < localStorage.getItem("bestRolls") ?
              localStorage.setItem("bestRolls", rolls) :
              ""
            }
            else{
              localStorage.setItem("bestRolls", rolls)
            }
            setDice(allNewDice())
            setTenzies(false)
            setRolls(10)
        }
    }

    function holdDice(id) {
        setDice(prevDice => prevDice.map(die => {
            return die.id === id ? 
                {...die, held: !die.held} : 
                die
        }))
    }

    // Mapping over the array of dice to create components for
    // each die.
    const diceElements = dice.map((die) => (
        <Die 
          // Key for each die equal to it's id property
          key={die.id} {...die} 
          // Passing down the holdDice function so that each
          // die can control its held state (true or false)
          hold={() => holdDice(die.id)} 
        />
    ))

    return (
        <main>
            {tenzies && <Confetti />}
            <div className="intro-container">
              <h1>Tenzies</h1>
              <p>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
              <p className="challenge">Want an extra challenge? Race against the clock!</p>
              {!countdownStarted && <button className="countdown-btn" id="countdown-btn" onClick={startCountdown}>Start Countdown</button>}
              {countdownStarted && <Timer />}
            </div>
            
            <div className="die-container">{diceElements}</div>
            <button className="roll-dice" onClick={rollUnheldDice}>
                {tenzies ? "Reset Game" : "Roll"}
            </button>
            <h3>Current rolls: {rolls} 
              <span className="best-rolls">Best rolls: {localStorage.getItem("bestRolls") ? localStorage.getItem("bestRolls") : "Unset"}</span>
            </h3>

        </main>
    )
}
