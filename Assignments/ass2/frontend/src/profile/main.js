import {errorPopup, fileToDataUrl, successPopup} from "../helpers.js";
import {BACKEND_PORT, DOMAIN} from "../config.js";

const token = 'Bearer ' + localStorage.getItem('token');
const userId = localStorage.getItem('userId');

const myProfileForm = document.getElementById('myProfileForm');
const passwordTypeButton = document.getElementById('passwordType');
const myProfileImage = document.getElementById('myProfileImage');
const uploadMyProfileImage = document.getElementById('uploadMyProfileImage');

const url = `${DOMAIN}:${BACKEND_PORT}/user/${userId}`;

function fetchProfile() {
    fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': token,
        }),
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
            renderMyProfile(data);
            return false;
        })
        .catch(error => {
            errorPopup(error.error)
        });
}

myProfileForm.addEventListener('submit', (event) => {
    event.preventDefault();

    fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': token,
        }),
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
            editProfile(data);
            return false;
        })
        .catch(error => {
            errorPopup(error.error)
        });

});

function editProfile(user) {
    const inputs = myProfileForm.getElementsByTagName('input');
    const data = {}

    if (user.email !== inputs['email'].value) {
        data.email = inputs['email'].value;
    }

    if (user.name !== inputs['name'].value) {
        data.name = inputs['name'].value;
    }

    if (user.bio !== myProfileForm.getElementsByTagName('textarea')['bio'].value) {
        data.bio = myProfileForm.getElementsByTagName('textarea')['bio'].value;
    }

    if (user.image !== myProfileImage.src && !myProfileImage.src.endsWith('default_avatar.png')) {
        data.image = myProfileImage.src;
    }

    const url = `${DOMAIN}:${BACKEND_PORT}/user`;

    fetch(url, {
        method: 'PUT',
        headers: new Headers({
            'Authorization': token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(data)
    }).then(response => {
        return response.json()
            .then(json => {
                if (response.ok) {
                    successPopup('You have successfully edited user profile');
                    fetchProfile();
                } else {
                    return Promise.reject(json);
                }
            })
    })
        .catch(error => {
            errorPopup(error.error)
        });

}

uploadMyProfileImage.addEventListener('change', event => {
    const file = event.target.files[0];
    const filePromise = fileToDataUrl(file);
    filePromise.then(data => {
        myProfileImage.src = data;
    })
})

function renderMyProfile(user) {
    const inputs = myProfileForm.getElementsByTagName('input');
    inputs['email'].value = user.email;
    inputs['name'].value = user.name;
    inputs['password'].value = window.atob(localStorage.getItem('password'));

    passwordTypeButton.addEventListener('click', () => {
        inputs['password'].type = inputs['password'].type === 'password' ? 'text' : 'password';
        passwordTypeButton.textContent = passwordTypeButton.textContent === 'show' ? 'hide' : 'show';
    })

    myProfileForm.getElementsByTagName('textarea')['bio'].value = user.bio;


    myProfileImage.src = user.image !== null ? user.image : '../../assets/default_avatar.png';
}

fetchProfile();