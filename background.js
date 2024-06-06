let user = null
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'login') {
        login(request)
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
        autoLogin().then(res => sendResponse(res))
        return true;
    }

});

chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        console.log(
            `Storage key "${key}" in namespace "${namespace}" changed.`,
            `Old value was "${oldValue}", new value is "${newValue}".`
        );
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
                user = response.text()
                return new Promise(resolve => {
                    if (response.status !== 200) resolve('fail')
                    console.log("hi")
                    chrome.storage.sync.set({token: response.headers.get("Authorization")})
                    resolve('success');
                    console.log("bye")
                })
            }).catch(err => console.log(err));
};

function getToken() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get('token', (result) => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve(result.token);
        });
    });
}

const autoLogin = async () => {
    try {
        const token = await getToken();
        console.log(token);

        if (token !== undefined) {
            const url = "http://localhost:3000/login"; // Endpoint for auto-login
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: token,
                },
            });
            user = response.text()
            if (response.status !== 200) {
                console.log('fail');
                return 'fail';
            }

            console.log("success");
            console.log(user)
            return 'success';
        } else {
            console.log('Token is undefined');
            return 'fail';
        }

    } catch (error) {
        console.error(error);
        return 'fail';
    }
};

const logout = async () =>{
    try {
        return await fetch("http://localhost:3000/logout",{
            method: "delete",
            headers: {
                "content-type": "application/json",
                Authorization: chrome.storage.sync.get('token')
            },
        }).then(response => {
            return new Promise(resolve => {
                if (response.status !== 200) resolve('fail')
                chrome.storage.sync.remove("token",function(){
                    var error = chrome.runtime.lastError;
                    if (error) {
                        console.error(error);
                    }
                })
                resolve('success');
            })
        }).catch(err => console.log(err));
    } catch (error) {
        console.log("error", error)
    }
}