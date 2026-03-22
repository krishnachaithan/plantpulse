# PlantPulse

## Current State
- Full-stack app with plant photo diagnosis, AI analysis, per-user diagnosis history, user profiles with display names, and sharing.
- Authorization system with admin/user/guest roles. Owner can be claimed via profile page.
- Backend: `getDiagnosisHistory(target)` only returns a single user's history. No way to list all users or view all diagnoses.
- Frontend: No admin dashboard exists.

## Requested Changes (Diff)

### Add
- Backend: `getAllUsersDiagnoses()` -- admin-only query returning all users' diagnoses with their principal and profile name.
- Backend: `getAllUsers()` -- admin-only query returning a list of all user principals and their profiles.
- Frontend: Owner/Admin Dashboard page accessible only when the caller is admin. Shows a table/list of all users and their diagnoses.

### Modify
- Frontend nav: Add an "Admin" link visible only to admins.

### Remove
- Nothing.

## Implementation Plan
1. Add `getAllUsersDiagnoses` and `getAllUsers` backend functions gated by `AccessControl.isAdmin`.
2. Regenerate backend bindings.
3. Build Admin Dashboard frontend page with user list and expandable diagnosis history per user.
4. Add conditional "Admin" nav link based on `isCallerAdmin()`.
