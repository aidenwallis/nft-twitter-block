function isNftKey(key) {
    // these are the current keys in twitter api responses for those avatars
    return key === "has_nft_avatar" || key === "ext_has_nft_avatar"
}

// recurse the json tree and set nft keys to false
function removeFromTree(tree) {
    if (Array.isArray(tree)) {
        for (const item of tree) {
            removeFromTree(item);
        }
        return;
    } else if (typeof tree === "object") {
        for (const key in tree) {
            if (isNftKey(key) && tree[key] === true) {
                // no :)
                tree[key] = false;
                continue;
            }

            if (typeof tree[key] === "object") {
                removeFromTree(tree[key]);
            }
        }
    }
}

function hijackResponse(response) {
    if (this.readyState !== 4) {
        return;
    }

    if (!(response.target.getResponseHeader("Content-Type") || "").startsWith("application/json")) {
        // ignore non json reqs
        return;
    }

    const body = response.target.responseText;

    const newBody = transform(body);
    // kill old responseText
    Object.defineProperty(this, "responseText", {
        get: () => newBody,
    });
}

function transform(text) {
    try {
        // attempt to parse the json, and modify tree, then set it back.
        const data = JSON.parse(text);
        if (typeof data !== "object") {
            return;
        }

        removeFromTree(data);
        const transformed = JSON.stringify(data);
        return transformed;
    } catch (error) {
        console.error("Failed to decode response", error);
        return text;
    }
}

// middleware to inject
function xhrMiddleware(original) {
    return function() {
        this.addEventListener("readystatechange", hijackResponse);
        return original.apply(this, arguments);
    };
}

// override xhr reqs
XMLHttpRequest.prototype.open = xhrMiddleware(XMLHttpRequest.prototype.open);
XMLHttpRequest.prototype.send = xhrMiddleware(XMLHttpRequest.prototype.send);