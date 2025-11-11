const { BehaviorSubject, combineLatest } = rxjs

const money = new BehaviorSubject(parseInt(localStorage.getItem("money")) || 0)
money.subscribe(newValue => {
    localStorage.setItem("money", newValue)
})
money.subscribe(newValue => {
    document.getElementById("actual-money").textContent = newValue
})

const currentDate = new BehaviorSubject(new Date())
setInterval(() => {
    currentDate.next(new Date())
}, 1_000)


combineLatest([money, currentDate]).subscribe(([money, currentDate]) => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const daysLeft = daysInMonth - currentDate.getDate();
    const weeksLeft = Math.ceil(daysLeft / 7);

    const dailyBudget = money / daysLeft;
    const weeklyBudget = money / weeksLeft;
    const hourlyBudget = dailyBudget / 24;

    document.getElementById("daily-budget").textContent = dailyBudget.toFixed(2);
    document.getElementById("weekly-budget").textContent = weeklyBudget.toFixed(2);
    document.getElementById("hourly-budget").textContent = hourlyBudget.toFixed(2);
})


function changeMoney(diff) {
    money.next(money.getValue() + diff)
}
function setMoney(newValue) {
    money.next(newValue)
}