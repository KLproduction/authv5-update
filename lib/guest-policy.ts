export function isGuestExpired(
  guestExpiresAt?: Date | string | null,
  now: Date = new Date()
) {
  if (!guestExpiresAt) {
    return false;
  }

  const expiresAt =
    typeof guestExpiresAt === "string"
      ? new Date(guestExpiresAt)
      : guestExpiresAt;

  if (Number.isNaN(expiresAt.getTime())) {
    return true;
  }

  return expiresAt.getTime() <= now.getTime();
}

export function serializeGuestExpiresAt(guestExpiresAt?: Date | null) {
  return guestExpiresAt ? guestExpiresAt.toISOString() : null;
}
