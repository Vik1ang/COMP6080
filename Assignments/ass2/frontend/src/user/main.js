import {errorPopup} from "../helpers.js";
import {BACKEND_PORT, DOMAIN} from "../config.js";

const token = 'Bearer ' + localStorage.getItem("token");

const url = `${DOMAIN}:${BACKEND_PORT}/user`;

const users = new Map();

function fetchUsers() {
    fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': token
        })
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
            data.users.map(user => {
                const {id} = user;
                const url = `${DOMAIN}:${BACKEND_PORT}/user/${id}`;
                fetch(url, {
                    method: 'GET',
                    headers: new Headers({
                        'Authorization': token
                    })
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
                        users.set(id, data);
                    })
                    .catch(error => {
                        errorPopup(error.error);
                        clearInterval(pollingUser);
                    });
            })
        })
        .catch(error => {
            errorPopup(error.error);
        });

}

fetchUsers();

const pollingUser = setInterval(fetchUsers, 120000);

export default users;