# Provider Config

## Supported providers

- Credentials
- Google
- GitHub

## Env keys

### Required

- `AUTH_SECRET` or `NEXTAUTH_SECRET`
- `DATABASE_URL`

### Optional

- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`
- `AUTH_GITHUB_ID`
- `AUTH_GITHUB_SECRET`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_SERVER_URL`
- `NEXT_PUBLIC_PRODUCTION_URL`

## Behavior

- If Google/GitHub credentials are present, the provider is enabled.
- If provider credentials are missing, that provider is skipped.
- If `RESEND_API_KEY` is missing in local/dev, email delivery becomes a no-op.

## Notes

- Auth decisions still happen on the server.
- Secrets are validated at startup so misconfiguration fails fast.
