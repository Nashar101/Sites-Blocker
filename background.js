


function removeAfterThirdSlash(url) {
    const match = url.match(/^([^/]+\/\/[^/]+)\/.*$/);
    return match ? match[1] : url;
}