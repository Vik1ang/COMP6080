import {errorPopup} from "../helpers.js";
import {BACKEND_PORT, DOMAIN} from "../config.js";

let logoutButton = document.getElementById('logoutButton');

if (logoutButton !== null) {
    logoutButton.onclick = () => {

        const url = `${DOMAIN}:${BACKEND_PORT}/auth/logout`;

        const token = "Bearer " + localStorage.getItem("token");

        console.log(token);

        fetch(url, {
            method: 'POST',
            headers: new Headers({
                'Authorization': token
            }),
        }).then(response => {
            return response.json()
                .then(json => {
                    if (response.ok) {
                        localStorage.clear();
                        location.reload();
                    } else {
                        return Promise.reject(json);
                    }
                })
        })
            .catch(error => {
                errorPopup(error.error);
                localStorage.clear();
                location.reload();
            });
    }

}
