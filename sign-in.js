
async function boot() {
    try {
        const response = await new Promise(resolve => {
            chrome.runtime.sendMessage({ message: 'autologin' }, resolve);
        });
            console.log(response)
        if (response === 'success')
            window.location.replace('./popup-sign-out.html');
    } catch (error) {
        console.error("Error while sending message:", error);
    }
}

boot();

document.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();

    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    if (email && password) {
        chrome.runtime.sendMessage({ message: 'login', 
        user: { email,    password }},
        function (response) {
            console.log(response)
            console.log("testing")
            if (response === 'success')
                window.location.replace('./popup-sign-out.html');
            console.log(response)
            console.log(response.email)
            console.log(response.body)
        });
    } else {
        document.querySelector('#email').placeholder = "Enter an email.";
        document.querySelector('#password').placeholder = "Enter a password.";
        document.querySelector('#email').style.backgroundColor = 'red';
        document.querySelector('#password').style.backgroundColor = 'red';
        document.querySelector('#email').classList.add('white_placeholder');
        document.querySelector('#password').classList.add('white_placeholder');
    }
});


