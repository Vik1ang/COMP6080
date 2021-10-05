let emailFieldCount = 0;
const welcomeMessage = document.getElementById('welcome-message');
const addMoreElementFields = document.getElementById('add-more-email-fields');
const submitButton = document.getElementById('submit');

const createEmailField = (count) => {
	const newItem = document.getElementById('email-box-template').cloneNode(true);
	newItem.id = '';
	newItem.classList.add('email-box');
	newItem.children[0].children[0].innerText = count;
	newItem.children[0].children[1].id = `email${count}`;
	document.getElementById('email-box-list').appendChild(newItem);
}

const addMoreEmailFields = () => {
	if (emailFieldCount <= 8) {
		createEmailField(emailFieldCount + 1);
		createEmailField(emailFieldCount + 2);
		emailFieldCount += 2;
		if (emailFieldCount >= 10) {
			addMoreElementFields.style.display = 'none';
		}
	}
}

welcomeMessage.addEventListener('blur', (event) => {
	if (welcomeMessage.value == '') {
		welcomeMessage.style.backgroundColor = 'red';
	}
});

welcomeMessage.addEventListener('keydown', (event) => {
	if (welcomeMessage.value != '') {
		welcomeMessage.style.backgroundColor = 'initial';
	}
});

addMoreElementFields.addEventListener('click', (event) => {
	addMoreEmailFields();
	event.preventDefault();
});

submitButton.addEventListener('click', (event) => {
	document.getElementById('my-modal').style.display = 'block';
	const emailInfo = document.getElementById('email-info');
	for (const child of emailInfo.children) {
		emailInfo.removeChild(child);
	}
	const emailBoxElements = document.getElementsByClassName('email-box');
	for (const box of emailBoxElements) {
		const singleInfo = document.createElement('div');
		singleInfo.innerText = box.children[0].children[1].value;
		emailInfo.appendChild(singleInfo);
	}
	event.preventDefault();
});

document.getElementById('confirm-popup').addEventListener('click', (event) => {
	document.getElementById('my-modal').style.display = 'none';
});

document.getElementById('cancel-popup').addEventListener('click', (event) => {
	document.getElementById('my-modal').style.display = 'none';
});

addMoreEmailFields();