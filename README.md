# nft-twitter-block

Changes NFT hexagon avatars back to the original circular ones.

## How it works

It's an extension that intercepts api requests from twitter, and sets the nft keys they use in responses to `false`. Thereby disabling it without having to inject into the React env.

`content-script.js` mounts `script.js` which intercepts XHR requests.