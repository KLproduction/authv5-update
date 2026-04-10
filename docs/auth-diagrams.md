# Auth Diagrams

This file summarizes the core boundaries of the auth kit.

## 1) Auth Flow

```mermaid
flowchart LR
  visitor["Visitor"] --> login["/auth/login"]
  visitor --> register["/auth/register"]
  visitor --> reset["/auth/reset"]

  login --> cred["Credentials / OAuth"]
  register --> verify["Email verification"]
  reset --> newpass["Set new password"]

  cred --> checked{"Server checks"}
  checked -->|email unverified| verify
  checked -->|2FA enabled| twofa["2FA confirmation"]
  checked -->|valid| jwt["JWT session"]
  twofa --> jwt
  verify --> jwt
  newpass --> jwt

  jwt --> app["Authenticated app"]
  app --> settings["Settings"]
  app --> admin["Admin"]

  admin --> admincheck{"Role policy"}
  settings --> policy{"Auth + ownership policy"}
  admincheck -->|ADMIN| allowed["Allowed"]
  admincheck -->|USER| denied["Forbidden"]
  policy -->|valid| saved["Update data"]
  policy -->|invalid| denied
```

## 2) Token Lifecycle

```mermaid
stateDiagram-v2
  [*] --> SignedOut
  SignedOut --> TokenIssued: sign in success
  TokenIssued --> SessionHydrated: jwt() + session()
  SessionHydrated --> ActiveSession: app request
  ActiveSession --> Revalidated: db user check
  Revalidated --> ActiveSession: user valid
  Revalidated --> SignedOut: user missing / guest expired / sign out
  ActiveSession --> SignedOut: sign out
```

## 3) Role / Permission Matrix

| Area | ADMIN | USER | Guest |
| --- | --- | --- | --- |
| Login / register / reset | Yes | Yes | Yes |
| Email verification | Yes | Yes | Yes |
| 2FA | Yes | Yes | No |
| Settings update | Yes | Own account only | No |
| Admin route | Yes | No | No |

## Notes

- `ADMIN` / `USER` are Prisma roles.
- `Guest` is an account state, not a separate Prisma role.
- All real authorization decisions happen on the server.
