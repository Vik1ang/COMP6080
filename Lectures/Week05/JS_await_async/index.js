async function getMeme() {
  const url = "https://api.chucknorris.io/jokes/random";

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }
    const data = await res.json();
    document.getElementById("meme-text").textContent = data.value;
  } catch (error) {
    console.error("There was a network error!!!!");
  }
}

function main() {
  document.getElementById("fetch-btn").addEventListener("click", getMeme);
}

main();
