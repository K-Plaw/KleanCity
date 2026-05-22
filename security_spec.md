# Firestore Security Specification

This document details the security model, invariants, and threat analysis for the KleanCity Firestore database.

## 1. Data Invariants & Access Control Matrix

| Collection | Path | Read Rule | Create Rule | Update Rule | Delete Rule |
|------------|------|-----------|-------------|-------------|-------------|
| **Users** | `/users/{userId}` | Is Owner (`auth.uid == userId`) | Is Owner & Valid Schema | Is Owner & Valid Schema | Denied |
| **Pickups** | `/pickups/{pickupId}` | Owner Only (`resource.data.userId == auth.uid`) | Owner Only & Valid Schema | Owner Only & Valid Schema & Status Locks | Denied |
| **Disputes** | `/disputes/{disputeId}` | Owner Only (`resource.data.userId == auth.uid`) | Owner Only & Valid Schema | Owner Only & Valid Schema | Denied |
| **Transactions** | `/transactions/{txnId}` | Owner Only | Owner Only & Valid Schema | Denied (Immutable Logs) | Denied |

### Core Rules & Constraints
- **Global Catch-All**: `match /{document=**} { allow read, write: if false; }` ensures absolute zero-trust default.
- **Identity Integrity**: For all writes, the `userId` or document ID (when referencing user collection) MUST match the authenticated user UID: `request.auth.uid`. No user can create records for other users.
- **Transaction Immutability**: Wallet transactions (`/transactions/*`) are write-once logs. No updates or deletions are allowed via standard client SDKs.
- **Size Enforcements**: All custom text and string inputs are capped with strict `.size()` constraints to protect against Denial of Wallet and buffer flooding.

---

## 2. The "Dirty Dozen" Threat Payloads (Targeted Malicious Activity)

The security rules are designed to prevent the following 12 bypass attempts:

1. **Privilege Escalation**: User A attempts to write or overwrite User B's `/users/userB` record.
2. **Infinite Wealth Exploit**: Malicious payload attempts to set a user profile's `walletBalance` to `9999999` upon registration or update.
3. **Ghost Fields Injection**: Sending shadow parameters into User Profile (e.g., `role: "admin"` or `isSystemVerified: true`).
4. **Identity Impersonation (Pickups)**: User A attempts to submit a pickup request `/pickups/12300` marking `userId: "userB"`.
5. **Malicious Transaction Spoofing**: Injecting fake `/transactions/txn_fake` with `amount: 10000` and `type: "funding"` without actually processing payment.
6. **Transaction Sabotage/Tampering**: User attempts to update or delete a previous transaction history entry to alter their audit trails.
7. **Size Exceeding Attack**: Sending 10MB of garbage characters to `/pickups/{pickupId}/landmark` to trigger high Firestore bandwidth costs.
8. **Negative Funding Vulnerability**: Creating a transaction with `amount: -5000` to drain or confuse balances.
9. **Status Fast-Tracking**: Creating a pickup directly in `Completed` status to receive free points without any physical pickup.
10. **ID Poisoning Attack**: Submitting a pickup with document ID containing 500 characters of weird escape sequences.
11. **Dispute Intrusion**: User A attempts to read User B's disputed tickets or write a review/resolution directly inside the restricted dispute record.
12. **Orphaned Dispute Injection**: Submitting a dispute referencing a non-existent `pickupId` to clutter system logs.

---

## 3. Test Cases Spec (Invariants Checked)

- `test_user_profile_isolation`: Only authenticated owner can fetch/write `/users/{uid}`.
- `test_user_balance_validation`: Balance must be positive and valid format.
- `test_transaction_write_once`: Once `transactions` is written, no updates or deletes are allowed.
- `test_pickup_identity`: Submitting a pickup with someone else's `userId` is denied.
- `test_character_limiting`: Excessive text arrays or massive bounds are blocked.
