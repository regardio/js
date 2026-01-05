# base64

URL-safe base64 to Uint8Array conversion, particularly useful for Web Push VAPID keys.

## Import

```ts
import { urlBase64ToUint8Array } from '@regardio/js/browser/base64';
```

## Usage

### Web Push VAPID Key

```ts
const vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';

const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);

const subscription = await registration.pushManager.subscribe({
  userVisibleOnly: true,
  applicationServerKey,
});
```

### Generic Base64 Decoding

```ts
const base64Data = 'SGVsbG8gV29ybGQ'; // URL-safe base64
const bytes = urlBase64ToUint8Array(base64Data);
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `base64String` | `string` | URL-safe base64 encoded string |

## Returns

| Type | Description |
|------|-------------|
| `Uint8Array` | Decoded binary data |

## URL-Safe Base64

URL-safe base64 uses:

- `-` instead of `+`
- `_` instead of `/`
- May omit padding `=`

This function handles the conversion automatically.

## Browser Only

This function uses `window.atob()` and is intended for browser environments only.

## Use Cases

- Web Push API subscription
- Binary data from URL parameters
- Decoding JWT tokens
- File upload handling

## Related

- [cookie](../http/cookie.md) — Cookie handling
