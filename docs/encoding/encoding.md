# @regardio/js/encoding

Binary encoding utilities.

## Installation

```ts
import { urlBase64ToUint8Array } from '@regardio/js/encoding';
```

## Functions

### urlBase64ToUint8Array

Convert a URL-safe base64 string to a Uint8Array.

```ts
const bytes = urlBase64ToUint8Array(vapidPublicKey);
```

**Use case:** Web Push API requires the VAPID public key as a Uint8Array.

```ts
const registration = await navigator.serviceWorker.ready;

const subscription = await registration.pushManager.subscribe({
  userVisibleOnly: true,
  applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
});
```

**Features:**

- Handles URL-safe base64 characters (`-` and `_` instead of `+` and `/`)
- Automatically adds padding if needed
- Works in browser environments (requires `window.atob`)
