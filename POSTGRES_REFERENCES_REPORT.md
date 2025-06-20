# PostgreSQL References Report

Generated on 2025-06-20T20:31:20.542Z

## API Routes with PostgreSQL References

- `app/api/admin/auth/route.ts`
- `app/api/admin/dashboard/route.ts`
- `app/api/admin/users/route.ts`
- `app/api/auth/login/route.ts`
- `app/api/auth/register/route.ts`
- `app/api/debug/emergency-login/route.ts`
- `app/api/debug/user/[id]/route.ts`
- `app/api/messages/route.ts`
- `app/api/messages/send/route.ts`
- `app/api/notifications/mark-as-read/route.ts`
- `app/api/notifications/route.ts`
- `app/api/profiles/[id]/route.ts`
- `app/api/profiles/block/route.ts`
- `app/api/profiles/delete-photo/route.ts`
- `app/api/profiles/interests/route.ts`
- `app/api/profiles/interests/update-status/route.ts`
- `app/api/profiles/report/route.ts`
- `app/api/profiles/respond-interest/route.ts`
- `app/api/profiles/send-interest/route.ts`
- `app/api/profiles/shortlist/route.ts`
- `app/api/profiles/undo-interest/route.ts`
- `app/api/profiles/update/route.ts`
- `app/api/profiles/upload-photo/route.ts`
- `app/api/profiles/upload-photos/route.ts`
- `app/api/subscriptions/plans/route.ts`
- `app/api/subscriptions/purchase/route.ts`
- `app/api/test/db-detail/route.ts`
- `app/api/test/db/route.ts`
- `app/api/upload/image/route.ts`
- `app/api/upload/profile-photo/route.ts`
- `app/api/verify/verify-otp/route.ts`

## Library Files with PostgreSQL References

- `lib/auth-options.ts`
- `lib/database-new.ts`
- `lib/database.ts`
- `lib/notifications.ts`
- `lib/verification-status.ts`
- `lib/verification.ts`
- `lib/db-logger.ts`

## Schema Files (To Be Archived)

- `src/db/index.ts`
- `src/db/migrate.ts`
- `src/db/schema.ts`

## Script Files with PostgreSQL References

- `scripts/check-db.ts`
- `scripts/migrate.ts`
- `scripts/security-check.ts`
- `scripts/add-occupation-columns.ts`
- `scripts/add-profile-photos-column.ts`
- `scripts/insert-admin-user.js`
- `scripts/rotate-credentials.js`
- `scripts/generate-credentials.js`

## Other Files with PostgreSQL References

- `drizzle.config.ts`

## Cleanup Recommendations

1. Update API routes to use Redis client
2. Update or remove unused library files
3. Archive schema files for reference
4. Update or remove script files that reference PostgreSQL
5. Review other files with PostgreSQL references
