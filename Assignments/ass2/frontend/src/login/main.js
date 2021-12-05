import {errorPopup} from "../helpers.js";
import {BACKEND_PORT, DOMAIN} from "../config.js";

let loginButton = document.getElementById('loginButton');

if (loginButton !== null) {
    loginButton.onclick = (event) => {

        event.preventDefault();

        console.log("login click");

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const url = `${DOMAIN}:${BACKEND_PORT}/auth/login`;
        const data = {
            email: email,
            password: password
        };

        fetch(url, {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(data)
        }).then(response => {
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
                location.reload();
            })
            .catch(error => {
                errorPopup(error.error);
            });
    }

}