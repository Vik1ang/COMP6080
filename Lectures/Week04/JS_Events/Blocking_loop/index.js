function startCalculating() {
    const n = 10000000;
    for (let i = 0; i <= n; i++) {
        document.getElementById("calc-txt").textContent = i.toString();
    }
}

function startCounting() {
    console.log("Starting to count up");
    let i = 0;
    setInterval(() => {
        i += 1;
        document.getElementById("counter-txt").textContent = i.toString();
    }, 1000);
}

function main() {
    const counterBtn = document.getElementById("start-counting-btn");
    const factorialBtn = document.getElementById("start-calc-btn");

    counterBtn.addEventListener("click", startCounting);
    factorialBtn.addEventListener("click", startCalculating);
}

main();