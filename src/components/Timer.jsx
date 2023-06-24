import React from "react"

export default function Timer(){
    const [seconds, setSeconds] = React.useState(30)

    const timerEndDate = Date.now() + 31000

    const getTime = () => {
        const timeLeft = timerEndDate - Date.now()
        timeLeft > 0 ? setSeconds(Math.floor((timeLeft / 1000) % 60)) :
        setSeconds(0)
    } 

    React.useEffect (() => {
        const interval = setInterval(() => getTime(timerEndDate), 1000)
        return () => clearInterval(interval)
    }, [])


    return (
        <div className="timer">
            <p>{seconds} seconds remaining</p>
        </div>
    )
}
