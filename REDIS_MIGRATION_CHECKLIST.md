# Redis Migration Checklist

## Core Components (Completed)

- ✅ Set up Redis environment variables
- ✅ Create Redis client (`lib/redis-client.ts`)
- ✅ Create Redis adapter for NextAuth (`lib/redis-adapter.ts`)
- ✅ Update NextAuth configuration (`lib/auth-options-redis.ts`)
- ✅ Create database service layer (`lib/database-service.ts`)
- ✅ Fix migration script TypeScript errors (`scripts/migrate-to-redis.ts`)
- ✅ Create sample data init script (`scripts/init-redis-with-sample-data.ts`)
- ✅ Create verification script (`scripts/verify-redis-data.ts`)
- ✅ Create API route converter examples (`scripts/api-route-converter.ts`)

## API Routes (Pending)

### Authentication & User Management
- [ ] `/api/auth/[...nextauth]/route.ts`
- [ ] `/api/auth/login/route.ts`
- [ ] `/api/auth/register/route.ts`
- [ ] `/api/register/route.ts`
- [ ] `/api/verify/send-otp/route.ts`
- [ ] `/api/verify/verify-otp/route.ts`

### Profile Management
- [ ] `/api/profiles/route.ts`
- [ ] `/api/profiles/[id]/route.ts`
- [ ] `/api/profiles/search/route.ts`
- [ ] `/api/profiles/update/route.ts`

### Interactions
- [ ] `/api/profiles/interests/route.ts`
- [ ] `/api/profiles/interests/update-status/route.ts`
- [ ] `/api/profiles/send-interest/route.ts`
- [ ] `/api/profiles/respond-interest/route.ts`
- [ ] `/api/profiles/undo-interest/route.ts`
- [ ] `/api/profiles/shortlist/route.ts`

### Notifications & Messages
- [ ] `/api/notifications/route.ts`
- [ ] `/api/notifications/mark-as-read/route.ts`
- [ ] `/api/messages/route.ts`
- [ ] `/api/messages/send/route.ts`

### Admin Routes
- [ ] `/api/admin/auth/route.ts`
- [ ] `/api/admin/dashboard/route.ts`
- [ ] `/api/admin/users/route.ts`
- [ ] `/api/admin/users/[id]/route.ts`

### Subscriptions & Payments
- [ ] `/api/payments/create-order/route.ts`
- [ ] `/api/payments/verify/route.ts`
- [ ] `/api/subscriptions/plans/route.ts`
- [ ] `/api/subscriptions/purchase/route.ts`

### Uploads & Media
- [ ] `/api/upload/image/route.ts`
- [ ] `/api/upload/profile-photo/route.ts`
- [ ] `/api/upload/delete/route.ts`
- [ ] `/api/profiles/upload-photo/route.ts`
- [ ] `/api/profiles/upload-photos/route.ts`
- [ ] `/api/profiles/delete-photo/route.ts`

## Testing

### Redis Operations
- ✅ Test Redis connection
- ✅ Test User CRUD operations
- ✅ Test Interest operations
- ✅ Test Shortlist operations
- ✅ Test Notification operations

### Authentication Flow
- [ ] Test user registration
- [ ] Test user login
- [ ] Test session management
- [ ] Test password reset flow

### Frontend Integration
- [ ] Test profile browsing
- [ ] Test search functionality
- [ ] Test interest/shortlist operations from UI
- [ ] Test notification display
- [ ] Test messaging functionality

## Final Steps

- [ ] Update API routes to use Redis (guided by checklist)
- [ ] Conduct end-to-end testing on critical flows
- [ ] Update documentation for Redis setup and maintenance
- [ ] Clean up any remaining PostgreSQL references
- [ ] Deploy and monitor the application

## Deployment

- [ ] Update environment variables on Vercel
- [ ] Set up monitoring for Redis connection
- [ ] Update deployment guide for Redis specifics
