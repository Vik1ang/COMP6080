function getFile() {
    const url = "https://api.chucknorris.io/jokes/random/blob";

    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.onload = () => {
        if (xhr.status === 200) {
            const meme = JSON.parse(xhr.response);

            document.getElementById("meme-txt").textContent = meme.value;
        } else {
            console.error("Could not complete sending request");
        }
    }

    try {
        xhr.send();
    } catch (e) {
        console.error("Cannot start sending request!")
    }
}

function main() {
    document.getElementById("fetch-btn").addEventListener("click", getFile);
}

main();
