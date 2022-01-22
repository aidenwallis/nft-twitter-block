(function() {
    const getURL = (url) => chrome.runtime.getURL(url);
    
    // mount script
    const el = document.createElement("script");
    el.src = getURL("script.js");
    (document.head || document.documentElement).appendChild(el);
})();