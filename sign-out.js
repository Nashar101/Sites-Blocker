
document.querySelector("#sign-out").addEventListener("click", () => {
    chrome.runtime.sendMessage({message: 'logout'},
        function (response) {
            console.log("this is response " + response)
            if (response === 'success') {
                console.log("you should change now");
                window.location.replace('./popup-sign-in.html');
            }
        }
    )
})
/**button.addEventListener('click', () => {

        chrome.runtime.sendMessage({message: 'logout'},
            function (response) {
                console.log("this is response " + response)
                if (response === 'success') {
                    console.log("you should change now");
                    window.location.replace('./popup-sign-in.html');
                }
            }
        )

});**/
