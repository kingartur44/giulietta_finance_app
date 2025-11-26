export function MonthViewer({ year, month, goLeft, goRight }) {

    const [isCreatingTransaction, setIsCreatingTransaction] = React.useState(false)

    const { total, dailyBudget, weeklyBudget, history, addTransaction, deleteTransaction } = useMonthData({year, month})


    const monthLabel = [
        "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
        "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
    ][month];

    if (isCreatingTransaction) {
        return <TransactionCreator addTransaction={addTransaction} close={() => setIsCreatingTransaction(false)} />
    }

    return <section className="month-content">
        <div>
            <div style={{display: "flex", justifyContent: "center", gap: 16}}>
                <div className="button" onClick={goLeft}>
                    &lt; &lt;
                </div>
                <h1>{monthLabel} {year}</h1>
                <div onClick={goRight} className="button">
                    &gt; &gt;
                </div>
            </div>
            
            <div className="budget-list">
                <div className="nes-container with-title is-centered is-rounded">
                    <h3 className="title nes-text is-primary">Budget mensile</h3>
                    <h1>{total.toFixed(2)} €</h1>
                </div>
                <div className="nes-container with-title is-centered is-rounded">
                    <h3 className="title nes-text is-primary">Budget settimanale</h3>
                    <h1>{weeklyBudget.toFixed(2)} €</h1>
                </div>
                <div className="nes-container with-title is-centered is-rounded">
                    <h3 className="title nes-text is-primary">Budget giornaliero</h3>
                    <h1>{dailyBudget.toFixed(2)} €</h1>
                </div>
            </div>
        </div>
        
        <button className="nes-btn is-primary" onClick={() => setIsCreatingTransaction(true)}>
            Crea nuova <br/> transazione
        </button>

        <h1>Storico</h1>
        <div style={{width: "100%", overflowX: "scroll"}}>
            <table className="nes-table is-bordered is-centered">
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Ammontare</th>
                        <th>Categoria</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {history.reverse().map(transaction => {
                        return <tr key={transaction.id}>
                            <td>{transaction.creationTime}</td>
                            <td style={{color: transaction.amount < 0 ? "red" : "green"}}>
                                {transaction.amount} €
                            </td>
                            <td>{transaction.label}</td>
                            <td>
                                <button className="nes-btn is-error" onClick={() => deleteTransaction({id: transaction.id})}>
                                    Elimina
                                </button>
                            </td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    </section>
}

export function TransactionCreator({addTransaction, close}) {
    const [amount, setAmount] = React.useState(0)
    const [label, setLabel] = React.useState("Generica")
    const [isNegative, setIsNegative] = React.useState(true)

    React.useEffect(() => {
        const handleBackButton = () => {
            close();
            return true;
        };

        document.addEventListener("backbutton", handleBackButton, false);

        return () => {
            document.removeEventListener("backbutton", handleBackButton, false);
        };
    }, [close]);

    return <div style={{display: "flex", flexDirection: "column", textAlign: "center"}}>
        <h1>Crea nuova transazione</h1>

        <div style={{marginBottom: 8}}>
            <h1 style={{color: isNegative ? "red" : "green"}}>{amount} €</h1>
            <div className="buttons-container">
                <button className="nes-btn" onClick={() => setAmount(old => old - 1)}>-1€</button>
                <button className="nes-btn" onClick={() => setAmount(old => old - 2)}>-2€</button>
                <button className="nes-btn" onClick={() => setAmount(old => old - 5)}>-5€</button>
                <button className="nes-btn" onClick={() => setAmount(old => old - 10)}>-10€</button>
                <button className="nes-btn" onClick={() => setAmount(old => old - 20)}>-20€</button>
                <button className="nes-btn" onClick={() => setAmount(old => old - 50)}>-50€</button>
            </div>
            <div className="buttons-container">
                <button className="nes-btn" onClick={() => setAmount(old => old + 1)}>+1€</button>
                <button className="nes-btn" onClick={() => setAmount(old => old + 2)}>+2€</button>
                <button className="nes-btn" onClick={() => setAmount(old => old + 5)}>+5€</button>
                <button className="nes-btn" onClick={() => setAmount(old => old + 10)}>+10€</button>
                <button className="nes-btn" onClick={() => setAmount(old => old + 20)}>+20€</button>
                <button className="nes-btn" onClick={() => setAmount(old => old + 50)}>+50€</button>
            </div>

            <h2>Tipo</h2>
            <button disabled={isNegative} style={{paddingRight: 8}} className={"nes-btn " + (isNegative ? "is-disabled" : "")} onClick={() => setIsNegative(true)}>
                Spesa
            </button>
            <button disabled={!isNegative} className={"nes-btn " + (isNegative ? "" : "is-disabled")} onClick={() => setIsNegative(false)}>
                Guadagno
            </button>
        
            <h2>Categoria spesa</h2>
            <div className="nes-select">
                <select onChange={(e) => setLabel(e.target.value)}>
                    <option value="Generica">Generica</option>
                    <option value="Spesa">Spesa</option>

                    <option value="Snack">Snack</option>
                    <option value="Divertimento">Divertimento</option>
                    <option value="Bollette">Bollette</option>

                    <option value="Stipendio">Stipendio</option>
                    <option value="Arca Arca">Arca Arca</option>
                    <option value="Aggiusto Conto">Aggiusto Conto</option>
                </select>
            </div>
        
        </div>

        <button className="nes-btn is-success" onClick={() => {
            let realAmount = isNegative ? -amount : amount
            addTransaction({amount: realAmount, label})
            close()
        }}>Crea</button>
        <button className="nes-btn is-warning" onClick={close}>Annulla</button>
    </div>

}


export function useMonthData({month, year}) {
    const [history, setHistory] = React.useState(() => getMonthData({month, year}))

    React.useEffect(() => {
        localStorage.setItem(`${year}-${month}`, JSON.stringify(history))
    }, [history])

    const addTransaction = ({amount, label}) => {
        setHistory(old => {
            return [...old, {
                id: old.length,
                creationTime: new Date().toLocaleString(),
                amount,
                label
            }]
        })
    }

    const deleteTransaction = ({id}) => {
        setHistory(old => {
            return old.filter(item => item.id !== id)
        })
    }

    const total = history.reduce((acc, curr) => {
        return acc + curr.amount
    }, 0)

    const daysInMonth = new Date(year, month, 0).getDate();
    
    const currentDate = new Date()
    let daysLeft = 0;
    if (currentDate.getFullYear() === year && currentDate.getMonth() === month) {
        daysLeft = daysInMonth - currentDate.getDate();
    } else {
        daysLeft = daysInMonth;
    }

    const weeksLeft = Math.ceil(daysLeft / 7);

    const dailyBudget = total / daysLeft;
    const weeklyBudget = total / weeksLeft

    return {
        total, dailyBudget, weeklyBudget, history, addTransaction, deleteTransaction
    }
}

function getMonthData({month, year}) {
    const history = localStorage.getItem(`${year}-${month}`)
    if (history === null) {
        return []
    }
    return JSON.parse(history)
}