function textInject(tag, str) {
    const elem = document.createElement(tag);
    elem.textContent = str;
    document.body.append(elem);
}

function fetchIP() {
    const url = "https://api.ipify.org/?format=json";

    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.onload = () => {
        if (xhr.status === 200) {
            const ip = JSON.parse(xhr.responseText);

            console.log(ip);

            document.getElementById("ip-text").textContent = ip.ip;

            textInject("h3", "We know where you are...");
        } else {
            console.error("Could not get the IP. RIP");
        }
    }

    try {
        xhr.send();
    } catch (e) {
        console.error("Could not get IP address. Maybe retry?");
    }
}

function main() {
    document.getElementById("ip-fetch-btn").addEventListener("click", fetchIP);
}

main();