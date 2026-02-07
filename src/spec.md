# Specification

## Summary
**Goal:** Build a Free Fire tournament app with Internet Identity sign-in, per-user profile and wallet, and a tournament browsing/joining flow with a cohesive esports-style theme.

**Planned changes:**
- Add Internet Identity authentication UI (sign in/out) and show the current user Principal in signed-in state.
- Implement backend profile storage keyed by caller Principal (display name optional, Free Fire UID, createdAt/updatedAt) with stable persistence and auth enforcement.
- Implement backend wallet (persisted balance + ledger entries) with a placeholder top-up method and atomic entry-fee debits on tournament join (no negative balances).
- Implement backend tournament model and APIs to list tournaments, fetch details (including joined players), and join with rule enforcement (auth/open status/no duplicates/max slots) and optional entry-fee deduction.
- Add frontend screens/navigation for Tournaments (list + details + join with errors), Wallet (balance + recent ledger + demo top-up), and Profile (edit/save display name + Free Fire UID).
- Require a Free Fire UID before allowing tournament join, with clear English guidance to update Profile.
- Apply a consistent dark esports visual theme (avoiding blue/purple as primary colors) across layout, typography, cards, and primary buttons.
- Add and reference generated static image assets from `frontend/public/assets/generated` (logo + hero/background + badges) in the UI.

**User-visible outcome:** Users can sign in with Internet Identity, set their Free Fire UID, view their wallet balance and transactions, browse tournaments, open details, and join eligible tournaments (with entry fees deducted when applicable), with clear join status and actionable English error messages.
