import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateGrandTotal,
  canSelectSeat,
  generateBookingId,
  getRemainingLockSeconds,
  MAX_SEATS_ALLOWED,
} from './pricing.js';

test('calculateGrandTotal computes correct subtotal, fees, and grand total in JavaScript', () => {
  const mockSeats = [
    { id: 'A1', row: 'A', number: 1, type: 'standard', price: 250 },
    { id: 'F5', row: 'F', number: 5, type: 'premium', price: 400 },
  ];

  const result = calculateGrandTotal(mockSeats);
  assert.equal(result.subtotal, 650);
  assert.equal(result.convenienceFee, Math.round(650 * 0.08));
  assert.equal(result.taxes, Math.round(52 * 0.18));
  assert.equal(result.grandTotal, 650 + 52 + 9);
});

test('canSelectSeat prevents selecting already booked seat', () => {
  const result = canSelectSeat('B4', [], ['B4', 'B5'], []);
  assert.equal(result.allowed, false);
  assert.match(result.reason || '', /already booked/i);
});

test('canSelectSeat prevents selecting seat with active lock from another user', () => {
  const activeLock = [{ seat: 'C3', userId: 'user_other', expiresAt: Date.now() + 60000 }];
  const result = canSelectSeat('C3', [], [], activeLock, 'user_me');
  assert.equal(result.allowed, false);
  assert.match(result.reason || '', /temporarily reserved/i);
});

test('canSelectSeat allows selecting own locked seat or expired lock', () => {
  const activeLock = [{ seat: 'C3', userId: 'user_me', expiresAt: Date.now() + 60000 }];
  const result = canSelectSeat('C3', [], [], activeLock, 'user_me');
  assert.equal(result.allowed, true);

  const expiredLock = [{ seat: 'D4', userId: 'user_other', expiresAt: Date.now() - 1000 }];
  const resultExpired = canSelectSeat('D4', [], [], expiredLock, 'user_me');
  assert.equal(resultExpired.allowed, true);
});

test('canSelectSeat enforces MAX_SEATS_ALLOWED limit', () => {
  const eightSeats = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8'];
  assert.equal(eightSeats.length, MAX_SEATS_ALLOWED);

  const result = canSelectSeat('A9', eightSeats, [], []);
  assert.equal(result.allowed, false);
  assert.match(result.reason || '', /maximum 8 seats/i);
});

test('generateBookingId produces INF- prefix formatted ID', () => {
  const id = generateBookingId();
  assert.match(id, /^INF-\d{8}-[A-Z0-9]{4}$/);
});

test('getRemainingLockSeconds returns zero for past timestamps', () => {
  const remaining = getRemainingLockSeconds(Date.now() - 5000);
  assert.equal(remaining, 0);
});
