import {createElement, errorPopup} from '../helpers.js'
import {showMessages} from '../message/main.js'
import {BACKEND_PORT, DOMAIN} from "../config.js";

const channelListNode = document.getElementById('channelList');
const newChannelButton = document.getElementById('newChannelButton');

const token = 'Bearer ' + localStorage.getItem("token");
const userId = localStorage.getItem("userId");


const url = `${DOMAIN}:${BACKEND_PORT}/channel`;

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
        const channels = data.channels;
        showChannels(channels);
    })
    .catch(error => errorPopup(error.error));


function showChannels(channelList) {

    let channels = [];
    const notJoinChannels = [];

    for (const channel of channelList) {
        if (channel.members.includes(parseInt(userId))) {
            channels.push(channel);
        } else {
            notJoinChannels.push(channel);
        }
    }

    channels = channels.concat(notJoinChannels);

    channels.map(channel => {

        const channelElem = createElement('a', '', 'list-group-item list-group-item-action');
        channelElem.id = channel.id;

        if (channel.members.includes(parseInt(userId))) {

            if (channel.private) {
                const privateTag = createElement('button', 'Private', 'btn btn-info m-3');
                privateTag.disabled = true;
                channelElem.appendChild(privateTag);
            } else {
                const publicTag = createElement('button', 'Public', 'btn btn-secondary m-3');
                publicTag.disabled = true;
                channelElem.appendChild(publicTag);
            }

            const channelName = createElement('span', channel.name, 'p-3 border');
            channelElem.appendChild(channelName);


            const showButton = createElement('button', 'Show', 'btn btn-primary m-3');
            showButton.setAttribute('data-toggle', 'modal');
            showButton.setAttribute('data-target', '#messagesToggle');
            channelElem.appendChild(showButton);

            showButton.addEventListener('click', () => {
                localStorage.removeItem('latestMessage');
                showMessages(channel, 0);
            })

            const detailsButton = createElement('button', 'Details ', 'btn btn-success m-3');
            detailsButton.setAttribute('data-toggle', 'modal');
            detailsButton.setAttribute('data-target', '#channelDetailsModal');
            channelElem.appendChild(detailsButton);

            detailsButton.addEventListener('click', () => {
                getChannelDetails(channel.id);
            })

            const leaveButton = createElement('button', 'Leave', 'btn btn-danger m-3');
            leaveButton.setAttribute('data-toggle', 'modal');
            leaveButton.setAttribute('data-target', '#leaveChannel');
            leaveButton.addEventListener('click', () => {
                leaveChannel(channel);
            })

            channelElem.appendChild(leaveButton);

        } else {

            const channelName = createElement('span', channel.name, 'p-3 border');
            channelElem.appendChild(channelName);

            const joinButton = createElement('button', 'Join', 'btn btn-primary m-3');
            joinButton.setAttribute('data-toggle', 'modal');
            joinButton.setAttribute('data-target', '#joinChannel');
            joinButton.addEventListener('click', () => {
                joinChannel(channel);
            })
            channelElem.appendChild(joinButton);
        }

        channelListNode.appendChild(channelElem);
    })
}

function leaveChannel(channel) {

    const {id, name} = channel;

    document.getElementById('leaveChannelMessage').textContent = 'Do you want to leave ' + name + '?';

    document.getElementById('leaveChannelConfirm').addEventListener('click', (event) => {
        event.preventDefault();
        const url = `http://localhost:5005/channel/${id}/leave`;

        fetch(url, {
            method: 'POST',
            headers: new Headers({
                'Authorization': token
            })
        })
            .then(response => {
                return response.json()
                    .then(json => {
                        if (response.ok) {
                            location.reload();
                        } else {
                            return Promise.reject(json);
                        }
                    })
            })

            .catch(error => {
                errorPopup(error.error);
            });

    })
}

function joinChannel(channel) {

    const {id, name} = channel;

    document.getElementById('joinChannelMessage').textContent = 'Do you want to join ' + name + '?';

    document.getElementById('joinChannelConfirm').addEventListener('click', (event) => {
        event.preventDefault();
        const url = `http://localhost:5005/channel/${id}/join`;

        fetch(url, {
            method: 'POST',
            headers: new Headers({
                'Authorization': token
            })
        })
            .then(response => {
                return response.json()
                    .then(json => {
                        if (response.ok) {
                            location.reload();
                        } else {
                            return Promise.reject(json);
                        }
                    })
            })
            .catch(error => errorPopup(error.error));

    })


}

if (newChannelButton !== null) {

    newChannelButton.onclick = (event) => {

        event.preventDefault();

        const url = "http://localhost:5005/channel";


        const data = {
            name: document.getElementById('newChannelName').value,
            private: document.getElementById('newChannelPrivate').checked,
            description: document.getElementById('newChannelDescription').value
        }

        fetch(url, {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': token
            }),
            body: JSON.stringify(data)
        })
            .then(response => {
                return response.json()
                    .then(json => {
                        if (response.ok) {
                            location.reload();
                        } else {
                            return Promise.reject(json);
                        }
                    })
            })
            .catch(error => errorPopup(error.error));
    };
}

function getChannelDetails(channelId) {
    const url = `http://localhost:5005/channel/${channelId}`;

    fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': token
        }),
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
            data.id = channelId;
            channelDetailsModal(data);
        })
        .catch(error => errorPopup(error.error));
}

function channelDetailsModal(channel) {
    document.getElementById('channelDetailsId').value = channel.id;
    document.getElementById('channelDetailsName').value = channel.name;
    document.getElementById('channelDetailsPrivate').checked = channel.private;
    document.getElementById('channelDetailsDescription').value = channel.description;
}

const updateChannelButton = document.getElementById('updateChannelDetails');

if (updateChannelButton !== null) {

    updateChannelButton.onclick = (event) => {

        event.preventDefault();

        const channelId = document.getElementById('channelDetailsId').value;

        const url = `http://localhost:5005/channel/${channelId}`;

        const data = {
            name: document.getElementById('channelDetailsName').value,
            description: document.getElementById('channelDetailsDescription').value
        }

        fetch(url, {
            method: 'PUT',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': token
            }),
            body: JSON.stringify(data)
        })
            .then(response => {
                return response.json()
                    .then(json => {
                        if (response.ok) {
                            location.reload();
                        } else {
                            return Promise.reject(json);
                        }
                    })
            })
            .catch(error => errorPopup(error.error));
    };

}