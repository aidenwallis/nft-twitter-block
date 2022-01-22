(function() {
    if (typeof browser === "undefined") {
        // Cross-browser compat
        var browser = chrome;
    }
    
    // mount script
    const el = document.createElement("script");
    el.src = browser.runtime.getURL("script.js");
    (document.head || document.documentElement).appendChild(el);
})();