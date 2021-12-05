// import {BACKEND_PORT} from './config.js';
// A helper you may want to use when uploading new images to the server.
// import {fileToDataUrl} from './helpers.js';

import {errorPopup} from "./helpers.js";

const token = localStorage.getItem('token');


function main() {
    import('./login/main.js');

    import('./logout/main.js');

    import('./registration/main.js');

    console.log(token);

    if (token !== null) {
        import('./channel/main.js');
        import('./profile/main.js')
        import('./user/main.js');

        document.getElementById('loginNav').style.display = 'none';
        document.getElementById('registerNav').style.display = 'none';

    } else {
        document.getElementById('logoutNav').style.display = 'none';
        document.getElementById('profileNav').style.display = 'none';

        errorPopup('Please login or registration first!');

    }

}

main();