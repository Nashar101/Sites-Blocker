chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'login') {
        login(request.payload)
            .then(res => sendResponse(res))
            .catch(err => console.log(err));
        return true;
    } 
    else if (request.message === 'logout') {
        logout(request.payload)
            .then(res => sendResponse(res))
            .catch(err => console.log(err));
        return true;
    }
    else if(request.message === 'autologin'){
        autoLogin().then(res => sendResponse({
            message: 'Auto Logged In',

        }))
    }

});

const login = async (userInfo) => {
        const url = "http://localhost:3000/login";
        return await fetch(url, {
                method: "post",
                headers: {
                    "content-type": "application/json",
                    accept: "application/json",
                },
                body: JSON.stringify(userInfo),
            }).then(response => {
                return new Promise(resolve => {
                    if (response.status !== 200) resolve('fail')

                    localStorage.setItem("token", response.headers.get("Authorization")),
                    function (response) {
                        if (chrome.runtime.lastError) 
                            resolve('fail');

                        user_signed_in = signIn;
                        resolve('success');
                    }
                })
            }).catch(err => console.log(err));
};

function autoLogin(){
    token = localStorage.getItem("token", response.headers.get("Authorization"));
    if(token){

    }
    else {

    }
}