function getFile() {
    const url = "https://api.chucknorris.io/jokes/random/blob";

    fetch(url)
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error(`Error: ${res.status}`);
            }
        })
        .then(data => document.getElementById("meme-txt").textContent = data.value)
        .catch(() => console.error("There was a network error!!!!"));
}

function main() {
    document.getElementById("fetch-btn").addEventListener("click", getFile);
}

main();