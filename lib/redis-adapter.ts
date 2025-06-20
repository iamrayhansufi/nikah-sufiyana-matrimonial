import type { Adapter } from "next-auth/adapters";
import { redis } from "./redis-client";

export function RedisAdapter(): Adapter {
  return {
    async createUser(data: any) {
      const id = `user:${Date.now()}`;
      const user = { ...data, id };
      await redis.hset(`user:${id}`, user as Record<string, unknown>);
      await redis.sadd("users", id);
      return user as any;
    },
    
    async getUser(id) {
      const user = await redis.hgetall(`user:${id}`);
      return user ? user as any : null;
    },
    
    async getUserByEmail(email) {
      if (!email) return null;
      
      const userIds = await redis.smembers("users");
      for (const id of userIds) {
        const user = await redis.hgetall(`user:${id}`);
        if (user && user.email === email) {
          return user as any;
        }
      }
      return null;
    },
      async getUserByAccount({ providerAccountId, provider }: any) {
      const accountKey = `account:${provider}:${providerAccountId}`;
      const userId = await redis.get(accountKey);
      if (!userId) return null;
      
      const getUser = this.getUser?.bind(this);
      if (getUser && typeof userId === 'string') {
        return await getUser(userId);
      }
      return null;
    },
    
    async updateUser(user) {
      await redis.hset(`user:${user.id}`, user);
      return user as any;
    },
      async linkAccount(account: any) {
      const accountId = `account:${account.provider}:${account.providerAccountId}`;
      await redis.set(accountId, account.userId);
      await redis.sadd(`user:${account.userId}:accounts`, accountId);
      
      return account as any;
    },
    
    async createSession(session) {
      const sessionId = `session:${session.sessionToken}`;
      await redis.hset(sessionId, session);
      await redis.expire(sessionId, 30 * 24 * 60 * 60); // 30 days
      
      await redis.set(`sessionToken:${session.sessionToken}`, session.userId);
      await redis.expire(`sessionToken:${session.sessionToken}`, 30 * 24 * 60 * 60); // 30 days
      
      return session as any;
    },
      async getSessionAndUser(sessionToken: string) {
      const userId = await redis.get(`sessionToken:${sessionToken}`);
      if (!userId || typeof userId !== 'string') return null;
      
      const session = await redis.hgetall(`session:${sessionToken}`);
      
      const getUser = this.getUser?.bind(this);
      let user = null;
      if (getUser) {
        user = await getUser(userId);
      }
      
      if (!session || !user) return null;
      
      return {
        session: session as any,
        user: user as any,
      };
    },
    
    async updateSession(session) {
      const sessionId = `session:${session.sessionToken}`;
      await redis.hset(sessionId, session);
      
      return session as any;
    },
    
    async deleteSession(sessionToken) {
      const userId = await redis.get(`sessionToken:${sessionToken}`);
      if (userId) {
        await redis.del(`sessionToken:${sessionToken}`);
        await redis.del(`session:${sessionToken}`);
      }
    },
      async createVerificationToken(verificationToken: any) {
      const tokenId = `verificationToken:${verificationToken.identifier}:${verificationToken.token}`;
      await redis.hmset(tokenId, verificationToken as Record<string, unknown>);
      await redis.expire(tokenId, 24 * 60 * 60); // 24 hours
      
      return verificationToken;
    },
    
    async useVerificationToken({ identifier, token }) {
      const tokenId = `verificationToken:${identifier}:${token}`;
      const verificationToken = await redis.hgetall(tokenId);
      
      if (!verificationToken) return null;
      
      await redis.del(tokenId);
      
      return verificationToken as any;
    },
  };
}
