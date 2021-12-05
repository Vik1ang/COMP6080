import {createElement, errorPopup, fileToDataUrl} from "../helpers.js";
import users from "../user/main.js";
import {BACKEND_PORT, DOMAIN} from "../config.js";

const token = 'Bearer ' + localStorage.getItem("token");
const userId = localStorage.getItem("userId");

const messageContentNode = document.getElementById('messageContent');
const messageSendButton = document.getElementById('sendMessage');
const editMessageSend = document.getElementById('editMessageSend');
const pinnedMessageContent = document.getElementById('pinnedMessageContent');
const uploadImages = document.getElementById('uploadImages');
const inviteDropDownMenu = document.getElementById('inviteDropDownMenu');
const inviteButton = document.getElementById('inviteButton');
const inviteForm = document.getElementById('inviteForm');
const closeMessage = document.getElementById('closeMessage');

let channelId = null;

let channelTemp = null;

let messagesTemp = null;

let globalStart = 0;

let pinnedMessageTemp = [];

let allMessages = [];

export function showMessages(channel, start) {


    channelId = channel.id;

    channelTemp = channel;

    globalStart = start;

    reRenderPinnedMessage();

    notification();

    document.getElementById('pinnedMessageToggle').addEventListener('click', () => {
        reRenderPinnedMessage();
    });

    renderAll(start, channel);

}

function renderAll(start, channel) {
    fetchMessages(channelId, globalStart)
        .then(data => {

            renderMessages(data);
            const messageWindowNode = document.getElementById('messageWindow');
            messageWindowNode.scrollTop = messageWindowNode.scrollHeight;

            const previousParent = document.getElementById('previousParent');
            if (start === 0) {
                previousParent.className = 'page-item disabled';
            } else {
                previousParent.className = 'page-item';
            }

            const nextParent = document.getElementById('nextParent');
            if (data.messages.length >= 25) {
                const next = document.getElementById('next');
                next.addEventListener('click', () => {
                    showMessages(channel, start + 25);
                });
                nextParent.className = 'page-item';
            } else {
                nextParent.className = 'page-item disabled';
            }

            const previous = document.getElementById('previous');
            previous.addEventListener('click', () => {
                showMessages(channel, start - 25 < 0 ? 0 : start - 25);
            })


        })
        .catch(error => {
            console.log('here');
            errorPopup(error.error)
        });
}

function renderMessages(messageList) {

    const {messages} = messageList;

    messagesTemp = messages;

    while (messageContentNode.hasChildNodes()) {
        messageContentNode.removeChild(messageContentNode.firstChild);
    }

    messages.sort((m1, m2) => {
        return new Date(m1.sentAt) - new Date(m2.sentAt);
    });

    const imagesList = [];

    messages.map(message => {
        if (message.image !== undefined) {
            imagesList.push(message.image);
        }
    })


    messages.map(message => {
        const user = users.get(message.sender);

        const pinButton = createElement('a', 'Pin', 'btn btn-primary');
        pinButton.addEventListener('click', () => pin(message.id));

        const unpinButton = createElement('a', 'Unpin', 'btn btn-primary');
        unpinButton.addEventListener('click', () => unpin(message.id));

        const reactButton = createElement('div', '', 'dropdown');
        const reactButtonNode = createElement('button', 'React', 'btn btn-primary dropdown-toggle');
        reactButtonNode.setAttribute('id', 'reactDropdownMenu');
        reactButtonNode.setAttribute('type', 'button');
        reactButtonNode.setAttribute('data-toggle', 'dropdown');
        reactButtonNode.setAttribute('aria-expanded', 'false');

        const dropdownMenu = createElement('div', '', 'dropdown-menu');
        dropdownMenu.setAttribute('aria-labelledby', 'reactDropdownMenu');

        const thumbLikesString = String.fromCodePoint(0x1F44D);
        const thumbLikes = createElement('a', thumbLikesString, 'dropdown-item');
        thumbLikes.addEventListener('click', () => {
            react(message.id, thumbLikesString)
            setTimeout(() => {
                refresh();
            }, 1000);
        });
        dropdownMenu.appendChild(thumbLikes);

        const thumbDislikeString = String.fromCodePoint(0x1F44E);
        const thumbDislike = createElement('a', thumbDislikeString, 'dropdown-item');
        thumbDislike.addEventListener('click', () => {
            react(message.id, thumbDislikeString);
            setTimeout(() => {
                refresh();
            }, 1000);
        })
        dropdownMenu.appendChild(thumbDislike);

        const starStruckString = String.fromCodePoint(0x1F929)
        const starStruck = createElement('a', starStruckString, 'dropdown-item');
        starStruck.addEventListener('click', () => {
            react(message.id, starStruckString);
            setTimeout(() => {
                refresh();
            }, 1000);
        });
        dropdownMenu.appendChild(starStruck);

        reactButton.appendChild(reactButtonNode);
        reactButton.appendChild(dropdownMenu);

        if (message.sender === parseInt(userId)) {


            const outerDiv = createElement('div', '', 'flex-row');

            const divNode = createElement('div', '', 'd-flex flex-row  p-3 justify-content-end');

            let messageContent;

            if (message.image !== undefined) {
                messageContent = createElement('a', '', '');
                messageContent.setAttribute('href', '#imageCarouse');
                messageContent.setAttribute('data-toggle', 'modal');
                const messageTemp = createElement('img', '', 'img-fluid');
                messageTemp.src = message.image;
                messageContent.addEventListener('click', () => {
                    const carousel = document.getElementById('carousel');
                    while (carousel.hasChildNodes()) {
                        carousel.removeChild(carousel.firstChild);
                    }

                    imagesList.map(image => {
                        let carouselItem;
                        const imgDom = createElement('img', '', 'img-fluid');
                        imgDom.src = image;
                        if (image === message.image) {
                            carouselItem = createElement('div', '', 'carousel-item active');

                        } else {
                            carouselItem = createElement('div', '', 'carousel-item');
                        }
                        carouselItem.appendChild(imgDom);
                        carousel.appendChild(carouselItem);
                    })

                })
                messageContent.appendChild(messageTemp);
            } else {
                messageContent = createElement('div', message.message, 'bg-success mr-2 p-3');
            }

            divNode.appendChild(messageContent);

            const cardNode = createElement('div', '', 'card');

            const imgDivNode = document.createElement('div');
            imgDivNode.setAttribute('style', 'width:40px; height: 40px;');
            const imgNode = createElement('img', '', 'img-thumbnail');
            imgNode.setAttribute('src', user.image !== null ? user.image : '../../assets/default_avatar.png');
            imgDivNode.appendChild(imgNode);

            const userNameNode = createElement('a', user.name, 'text-center');
            userNameNode.setAttribute('href', '#userProfileToggle');
            userNameNode.setAttribute('data-toggle', 'modal');

            userNameNode.addEventListener('click', () => {
                const profileEmail = document.getElementById('profileEmail');
                const profileName = document.getElementById('profileName');
                const profileBio = document.getElementById('profileBio');
                const profileAvatar = document.getElementById('profileAvatar');

                getUserDetails(message.sender).then(user => {
                    profileEmail.value = user.email;
                    profileName.value = user.name;
                    profileBio.value = user.bio;
                    profileAvatar.setAttribute('src', user.image !== null ? user.image : '../../assets/default_avatar.png');
                    return false;
                })
                    .catch(error => {
                        console.log('here');
                        errorPopup(error.error)
                    });
            })

            cardNode.appendChild(imgDivNode);
            cardNode.appendChild(userNameNode);

            divNode.appendChild(cardNode);

            const buttonDiv = createElement('div', '', 'd-flex flex-row p-3 justify-content-end');
            if (message.pinned) {
                // messageContent.className += ' rounded-pill';
                // messageContent.setAttribute('style', 'font-weight: bold; border: solid 2px red;');
                buttonDiv.appendChild(unpinButton);
            } else {
                buttonDiv.appendChild(pinButton);
            }

            const deleteButton = createElement('a', 'Delete', 'btn btn-primary');
            deleteButton.addEventListener('click', (event) => {
                event.preventDefault();
                const url = `${DOMAIN}:${BACKEND_PORT}/message/${channelId}/${message.id}`;
                fetch(url, {
                    method: 'DELETE',
                    headers: new Headers({
                        'Authorization': token,
                    }),
                }).then(response => {
                    return response.json()
                        .then(json => {
                            if (response.ok) {
                                refresh();
                            } else {
                                return Promise.reject(json);
                            }
                        })
                })
                    .catch(error => {
                        console.log('here');
                        errorPopup(error.error)
                    });
            });

            const editButton = createElement('a', 'Edit', 'btn btn-primary');
            editButton.setAttribute('data-toggle', 'modal');
            editButton.setAttribute('href', '#editMessageToggle');
            editButton.addEventListener('click', event => {
                event.preventDefault();
                document.getElementById('editMessageContent').value = message.message;
                // localStorage.setItem('editMessageId', message.id);

                if (editMessageSend !== null) {
                    editMessageSend.onclick = () => {
                        const url = `${DOMAIN}:${BACKEND_PORT}/message/${channelId}/${message.id}`;
                        // event.preventDefault();
                        const data = {
                            message: document.getElementById('editMessageContent').value
                        }
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
                                        document.getElementById('editMessageToggle').className = 'modal fade';
                                        refresh();
                                    } else {
                                        return Promise.reject(json);
                                    }
                                })
                        })
                            .catch(error => {
                                console.log('here');
                                errorPopup(error.error)
                            });
                    }
                }


            });

            buttonDiv.appendChild(reactButton);
            buttonDiv.appendChild(editButton);
            buttonDiv.appendChild(deleteButton);

            const reactsMessages = message.reacts;
            const reactAreaNode = createElement('div', '', 'd-flex flex-row  p-3 justify-content-end');

            reactsMessages.map(react => {
                let reactNode;
                if (react.user === parseInt(userId)) {
                    reactNode = createElement('a', react.react, ' p-3 border border-primary');
                    reactNode.type = 'button';
                    reactNode.addEventListener('click', () => {
                        unreact(message.id, react.react);
                        setTimeout(() => {
                            refresh();
                        }, 1000);
                    });
                } else {
                    reactNode = createElement('a', react.react, ' p-3');

                }
                reactAreaNode.appendChild(reactNode);
            })

            const timeDiv = createElement('div', new Date(message.sentAt).toUTCString(), 'd-flex flex-row p-3 justify-content-end');


            outerDiv.appendChild(divNode);
            outerDiv.appendChild(timeDiv);
            if (message.edited) {
                const editDiv = createElement('div', 'Edited At ' + new Date(message.editedAt).toUTCString(), 'd-flex flex-row p-3 justify-content-end border border-primary');
                outerDiv.appendChild(editDiv);
            }
            outerDiv.appendChild(reactAreaNode);
            outerDiv.appendChild(buttonDiv);

            messageContentNode.appendChild(outerDiv);

        } else {

            const outerDiv = createElement('div', '', 'flex-row');

            const divNode = createElement('div', '', 'd-flex flex-row  p-3');

            const cardNode = createElement('div', '', 'card');

            const imgDivNode = document.createElement('div');
            imgDivNode.setAttribute('style', 'width:40px; height: 40px;');
            const imgNode = createElement('img', '', 'img-thumbnail')
            imgNode.setAttribute('src', user.image !== null ? user.image : '../../assets/default_avatar.png');
            imgDivNode.appendChild(imgNode);

            const userNameNode = createElement('a', user.name, 'text-center');
            userNameNode.setAttribute('href', '#userProfileToggle');
            userNameNode.setAttribute('data-toggle', 'modal');

            userNameNode.addEventListener('click', () => {
                const profileEmail = document.getElementById('profileEmail');
                const profileName = document.getElementById('profileName');
                const profileBio = document.getElementById('profileBio');
                const profileAvatar = document.getElementById('profileAvatar');

                getUserDetails(message.sender).then(user => {
                    profileEmail.value = user.email;
                    profileName.value = user.name;
                    profileBio.value = user.bio;
                    profileAvatar.setAttribute('src', user.image !== null ? user.image : '../../assets/default_avatar.png');
                    return false;
                })
                    .catch(error => {
                        console.log('here');
                        errorPopup(error.error)
                    });
            })

            cardNode.appendChild(imgDivNode);
            cardNode.appendChild(userNameNode);

            divNode.appendChild(cardNode);

            // divNode.appendChild(imgNode);

            let messageContent;

            if (message.image !== undefined) {
                messageContent = createElement('a', '', '');
                messageContent.setAttribute('href', '#imageCarouse');
                messageContent.setAttribute('data-toggle', 'modal');
                const messageTemp = createElement('img', '', 'img-fluid');
                messageTemp.src = message.image;
                messageContent.addEventListener('click', () => {
                    const carousel = document.getElementById('carousel');
                    while (carousel.hasChildNodes()) {
                        carousel.removeChild(carousel.firstChild);
                    }

                    imagesList.map(image => {
                        let carouselItem;
                        const imgDom = createElement('img', '', 'img-fluid');
                        imgDom.src = image;
                        if (image === message.image) {
                            carouselItem = createElement('div', '', 'carousel-item active');

                        } else {
                            carouselItem = createElement('div', '', 'carousel-item');
                        }
                        carouselItem.appendChild(imgDom);
                        carousel.appendChild(carouselItem);
                    })

                })
                messageContent.appendChild(messageTemp);
            } else {
                messageContent = createElement('div', message.message, 'bg-info ml-2 p-3');
            }

            divNode.appendChild(messageContent);


            const buttonDiv = createElement('div', '', 'd-flex flex-row p-3');

            buttonDiv.appendChild(reactButton);

            if (message.pinned) {
                messageContent.className += ' rounded-pill';
                messageContent.setAttribute('style', 'font-weight: bold; border: solid 2px red;');
                buttonDiv.appendChild(unpinButton);
            } else {
                buttonDiv.appendChild(pinButton);
            }

            const reactsMessages = message.reacts;
            const reactAreaNode = createElement('div', '', 'd-flex flex-row  p-3');

            reactsMessages.map(react => {
                let reactNode;
                if (react.user === parseInt(userId)) {
                    reactNode = createElement('a', react.react, ' p-3 border border-primary');
                    reactNode.type = 'button';
                    reactNode.addEventListener('click', () => {
                        unreact(message.id, react.react);
                        setTimeout(() => {
                            refresh();
                        }, 1000);
                    });
                } else {
                    reactNode = createElement('a', react.react, 'p-3');
                }
                reactAreaNode.appendChild(reactNode);
            })

            const timeDiv = createElement('div', new Date(message.sentAt).toUTCString(), 'd-flex flex-row p-3');

            outerDiv.appendChild(divNode);
            outerDiv.appendChild(timeDiv);
            outerDiv.appendChild(reactAreaNode);
            outerDiv.appendChild(buttonDiv);

            messageContentNode.appendChild(outerDiv);

        }
    })

}

if (messageSendButton !== null) {
    messageSendButton.onclick = event => {
        event.preventDefault();
        const url = `${DOMAIN}:${BACKEND_PORT}/message/${channelId}`;
        let data = {
            message: document.getElementById('sendMessageContent').value,
            // image: null
        };

        fetch(url, {
            method: 'POST',
            headers: new Headers({
                'Authorization': token,
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(data)
        }).then(response => {
            return response.json()
                .then(json => {
                    if (response.ok) {
                        document.getElementById('sendMessageContent').value = '';
                        refreshAndScrollDown();
                    } else {
                        return Promise.reject(json);
                    }
                })
        })
            .catch(error => {
                console.log('here');
                errorPopup(error.error)
            });
    };

}

if (uploadImages !== null) {
    uploadImages.addEventListener('change', event => {
        const files = event.target.files;
        Object.keys(files).forEach(index => {
            const filePromise = fileToDataUrl(files[index]);
            filePromise.then(base64String => {

                const data = {
                    'image': base64String
                }

                fetch(`${DOMAIN}:${BACKEND_PORT}/message/${channelId}`, {
                    method: 'POST',
                    headers: new Headers({
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    }),
                    body: JSON.stringify(data)
                }).then(response => {
                    return response.json()
                        .then(json => {
                            if (response.ok) {
                                refresh();
                                return json;
                            } else {
                                return Promise.reject(json);
                            }
                        })
                })
                    .catch(error => {
                        console.log('here');
                        errorPopup(error.error)
                    });
            })
        })
    })
}

function pin(messageId) {
    const url = `${DOMAIN}:${BACKEND_PORT}/message/pin/${channelId}/${messageId}`;
    fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': token,
        }),
    }).then(response => {
        return response.json()
            .then(json => {
                if (response.ok) {
                    refresh();
                    reRenderPinnedMessage();
                    return json;
                } else {
                    return Promise.reject(json);
                }
            })
    })
        .catch(error => {
            console.log('here');
            errorPopup(error.error)
        });
}

function unpin(messageId) {
    const url = `${DOMAIN}:${BACKEND_PORT}/message/unpin/${channelId}/${messageId}`;
    fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': token,
        }),
    }).then(response => {
        return response.json()
            .then(json => {
                if (response.ok) {
                    refresh();
                    reRenderPinnedMessage();
                    return json;
                } else {
                    return Promise.reject(json);
                }
            })
    })
        .catch(error => {
            console.log('here');
            errorPopup(error.error)
        });

}

function react(messageId, reactString) {
    const url = `${DOMAIN}:${BACKEND_PORT}/message/react/${channelId}/${messageId}`;

    const data = {
        "react": reactString
    }


    fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': token,
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
        .catch(error => {
            console.log('here');
            errorPopup(error.error)
        });
}

function unreact(messageId, reactString) {
    const url = `${DOMAIN}:${BACKEND_PORT}/message/unreact/${channelId}/${messageId}`;

    const data = {
        "react": reactString
    }

    fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(data)
    }).then(response => {
        return response.json()
            .then(json => {
                if (response.ok) {
                    refresh();
                    return json;
                } else {
                    return Promise.reject(json);
                }
            })
    })
        .catch(error => {
            console.log('here');
            errorPopup(error.error)
        });

}

function getUserDetails(userId) {

    return fetch(`${DOMAIN}:${BACKEND_PORT}/user/${userId}`, {
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

}


inviteButton.addEventListener('click', (event) => {
    event.preventDefault();
    const userList = inviteForm.user;
    userList.forEach(user => {
        if (user.checked) {
            const data = {
                userId: parseInt(user.value)
            }
            fetch(`${DOMAIN}:${BACKEND_PORT}/channel/${channelId}/invite`, {
                method: 'POST',
                headers: new Headers({
                    'Authorization': token,
                    'Content-Type': 'application/json',
                }),
                body: JSON.stringify(data)
            }).then(response => {
                if (response.ok) {
                    return response.json();
                }
            })
        }
    })

})

inviteDropDownMenu.addEventListener('click', () => getInviteUserList());

function getInviteUserList() {

    while (inviteForm.hasChildNodes()) {
        inviteForm.removeChild(inviteForm.firstChild);
    }

    let userList = [];

    users.forEach((value, key) => {
        userList.push({...value, id: key});
    })

    userList = userList.sort((u1, u2) => {
        return u1.name.localeCompare(u2.name);
    })


    userList.map(user => {
        const formCheck = createElement('div', '', 'form-check');
        const label = createElement('label', '', 'form-check-label');
        const input = createElement('input', '', 'form-check-input');
        input.name = 'user';
        input.type = 'checkbox';
        input.value = user.id;

        label.appendChild(input);
        label.append(user.name + ' ' + user.email);
        formCheck.appendChild(label);
        inviteForm.appendChild(formCheck);
    })

}


function fetchMessages(channelId, start) {
    return fetch(`${DOMAIN}:${BACKEND_PORT}/message/${channelId}?start=${start}`, {
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
        .catch(error => {
            console.log('here');
            errorPopup(error.error);
        })
}

function refresh() {
    fetchMessages(channelId, globalStart)
        .then(data => {
            renderMessages(data);
        })
        .catch(error => {
            console.log('here');
            errorPopup(error.error)
        });

}

function refreshAndScrollDown() {
    fetchMessages(channelId, globalStart)
        .then(data => {
            renderMessages(data);
            const messageWindowNode = document.getElementById('messageWindow');
            messageWindowNode.scrollTop = messageWindowNode.scrollHeight;
        })
        .catch(error => {
            console.log('here');
            errorPopup(error.error)
        });
}

function fetchAllByRecursion(start) {

    const url = `${DOMAIN}:${BACKEND_PORT}/message/${channelId}?start=${start}`;
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
            if (data.messages.length <= 0) {

            } else {
                start += 25;
                data.messages.map(message => {
                    allMessages.push(message);
                    if (message.pinned) {
                        renderPinnedMessage(message);
                    }
                });
                fetchAllByRecursion(start);
            }
        })
        .catch(error => {
            console.log('here');
            console.log(error);
        })

}


function reRenderPinnedMessage() {
    while (pinnedMessageContent.hasChildNodes()) {
        pinnedMessageContent.removeChild(pinnedMessageContent.firstChild);
    }
    fetchAllByRecursion(0);
}

function renderPinnedMessage(message) {
    pinnedMessageTemp.push(message);

    const user = users.get(message.sender);

    const outerDiv = createElement('div', '', 'flex-row');

    const divNode = createElement('div', '', 'd-flex flex-row  p-3');

    const cardNode = createElement('div', '', 'card');

    const imgDivNode = document.createElement('div');
    imgDivNode.setAttribute('style', 'width:40px; height: 40px;');
    const imgNode = createElement('img', '', 'img-thumbnail')
    imgNode.setAttribute('src', user.image !== null ? user.image : '../../assets/default_avatar.png');
    imgDivNode.appendChild(imgNode);

    const userNameNode = createElement('a', user.name, 'text-center');
    userNameNode.setAttribute('href', '#userProfileToggle');
    userNameNode.setAttribute('data-toggle', 'modal');

    cardNode.appendChild(imgDivNode);
    cardNode.appendChild(userNameNode);

    divNode.appendChild(cardNode);

    let messageContent;

    if (message.image !== undefined) {
        messageContent = createElement('img', '', 'img-fluid');
        messageContent.src = message.image;
    } else {
        messageContent = createElement('div', message.message, 'bg-info ml-2 p-3');
    }

    divNode.appendChild(messageContent);

    const buttonDiv = createElement('div', '', 'd-flex flex-row p-3');
    const unpinButton = createElement('a', 'Unpin', 'btn btn-primary');
    unpinButton.addEventListener('click', () => unpin(message.id));
    buttonDiv.append(unpinButton);

    const reactsMessages = message.reacts;
    const reactAreaNode = createElement('div', '', 'd-flex flex-row  p-3');


    reactsMessages.map(react => {
        if (react.user === parseInt(userId)) {
            const reactNode = createElement('a', react.react, ' p-3');
            reactNode.type = 'button';
            reactNode.addEventListener('click', () => {
                unreact(message.id, react.react);
                refresh();
            });
            reactAreaNode.appendChild(reactNode);
        }
    })

    const timeDiv = createElement('div', new Date(message.sentAt).toUTCString(), 'd-flex flex-row p-3');

    outerDiv.appendChild(divNode);
    outerDiv.appendChild(timeDiv);
    outerDiv.appendChild(reactAreaNode);
    outerDiv.appendChild(buttonDiv);

    pinnedMessageContent.appendChild(outerDiv);
}

function notification() {
    const poll = setInterval(() => {
        fetchMessages(channelId, 0)
            .then(data => {
                const latest = localStorage.getItem('latestMessage');
                const temp = data.messages[0].sender + ' ' + data.messages[0].sentAt;
                if (latest !== null) {
                    if (temp.startsWith(userId.toString())) {
                    } else if (temp.localeCompare(latest) !== 0) {
                        localStorage.setItem('latestMessage', data.messages[0].sender + ' ' + data.messages[0].sentAt);
                        const messageNotification = document.getElementById('messageNotification');
                        messageNotification.textContent = 'There are new messages! click me !!!';
                        messageNotification.addEventListener('click', () => {
                            messageNotification.textContent = '';
                            renderAll(globalStart, channelTemp);
                        });

                    }

                } else {
                    localStorage.setItem('latestMessage', data.messages[0].sender + ' ' + data.messages[0].sentAt);
                }
            })
            .catch(error => {
                console.warn('this channel does not have any messages!');
            });

    }, 1500);

    const getUser = setInterval(() => {
        fetch(`${DOMAIN}:${BACKEND_PORT}/user`, {
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
                })
            })
            .catch(error => {
                errorPopup(error.error);
            });
    }, 1000)

    closeMessage.addEventListener('click', () => {
        clearInterval(poll);
        clearInterval(getUser);
        localStorage.removeItem('latestMessage');
    })

}