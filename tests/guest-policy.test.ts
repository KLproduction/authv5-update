import test from "node:test";
import assert from "node:assert/strict";
import {
  isGuestExpired,
  serializeGuestExpiresAt,
} from "../lib/guest-policy";

test("serializeGuestExpiresAt converts Date to ISO string", () => {
  const date = new Date("2026-04-10T12:00:00.000Z");

  assert.equal(serializeGuestExpiresAt(date), date.toISOString());
  assert.equal(serializeGuestExpiresAt(null), null);
});

test("isGuestExpired handles valid, expired, and invalid inputs", () => {
  const now = new Date("2026-04-10T12:00:00.000Z");

  assert.equal(
    isGuestExpired(new Date("2026-04-10T11:59:59.000Z"), now),
    true
  );
  assert.equal(
    isGuestExpired(new Date("2026-04-10T12:00:01.000Z"), now),
    false
  );
  assert.equal(isGuestExpired("2026-04-10T12:00:01.000Z", now), false);
  assert.equal(isGuestExpired("not-a-date", now), true);
});
