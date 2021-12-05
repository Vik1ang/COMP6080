import {errorPopup, successPopup} from "../helpers.js";

const registerButton = document.getElementById('registrationButton');

registerButton.addEventListener('click', event => {
    event.preventDefault();

    const email = document.getElementById('RegisterEmail').value;
    const name = document.getElementById('RegisterName').value;
    const password = document.getElementById('RegisterPassword').value;

    const url = "http://localhost:5005/auth/register";

    let data = {
        "email": email,
        "password": password,
        "name": name
    }

    fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(data)
    })
        .then(response => {
            return response.json()
                .then(json => {
                    if (response.ok) {
                        return json;
                    } else {
                        return Promise.reject(json);
                    }
                })
        })
        .then(data => {
            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("password", window.btoa(password));
            successPopup('You have been successfully registered');
            location.reload();
        })
        .catch(error => errorPopup(error.error));
})