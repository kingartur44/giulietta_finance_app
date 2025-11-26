import {MonthViewer} from "/js/components/MonthViewer.jsx"

function StartScreen() {

    const [currentDate, setCurrentDate] = React.useState(new Date())

    const goLeft = () => {
        const previousDate = new Date(currentDate)
        previousDate.setMonth(currentDate.getMonth() - 1)
        setCurrentDate(previousDate)
    }
    const goRight = () => {
        const nextDate = new Date(currentDate)
        nextDate.setMonth(currentDate.getMonth() + 1)
        setCurrentDate(nextDate)
    }

    const month = currentDate.getMonth()
    const year = currentDate.getFullYear()

    return <div>
        <h1 style={{textAlign: "center"}}>Giulietta Finance App</h1>
        <MonthViewer key={`${year}-${month}`} goLeft={goLeft} goRight={goRight} month={month} year={year} />
    </div>
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<StartScreen />);