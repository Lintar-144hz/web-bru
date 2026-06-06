# Security Specification & "Fortress" Verification Plan

## 1. Data Invariants
- **Articles**: Viewable by the general public. Modifiable ONLY by verified administrator with email `tarzzgg1@gmail.com`.
- **Projects**: Viewable by the general public. Modifiable ONLY by verified administrator with email `tarzzgg1@gmail.com`.
- **Gallery**: Viewable by the general public. Modifiable ONLY by verified administrator with email `tarzzgg1@gmail.com`.
- **Stats**: Viewable by the public. Total views count can be incremented from any browser session but strictly restricted to prevent modifying arbitrary fields or non-numeric value injection.

---

## 2. The "Dirty Dozen" Exploit Payloads
The following payloads will automatically return `PERMISSION_DENIED` under this security setup:

1. **Spoofed Admin Session**: Admin write with email `tarzzgg1@gmail.com` but `request.auth.token.email_verified == false`.
2. **Anonymous Admin Access**: An unauthenticated user tries to write/edit/delete/publish an article.
3. **Invalid Data Schema Injection**: Creating an article containing hidden parameters/extra keys (e.g. `isAdmin: true` or `restricted: true`).
4. **Huge Field Size Overflow**: Creating a project description exceeding 5,000 characters to consume storage space.
5. **ID Poisoning Attack**: Trying to construct paths with malicious strings or excessively long IDs (e.g., matching length size boundaries).
6. **Immutable Field Altering**: Changing `createdAt` or `author` on an existing post.
7. **Stats Resource Destruction**: Modifying total views counter to high values or negative steps instead of valid numeric increments.
8. **Impersonating Project Authorship**: Creating/updating projects with a spoofed creator UID.
9. **Draft State Hijacking**: Modifying the publication status or publishing articles belonging to drafts.
10. **Malicious Link Injection**: Writing harmful scripts or cross-site references directly into image URLs.
11. **Gallery Caption Overflow**: Injecting a gallery card caption with a payload of over 1,000 characters.
12. **Unauthenticated Bulk Listing (Denial of Wallet)**: Triggering recursion inside complex listing loops to scale reads.

---

## 3. Verified Security Rules Architecture
We enforce maximum defense-in-depth security with the `/firestore.rules` containing schema types, precise sizes, and verified email checks.
