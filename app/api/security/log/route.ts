import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis-client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options-redis';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    const { event, reason, timestamp, userAgent, url } = await request.json();

    // Create security log entry
    const securityLog = {
      userId: session?.user?.id || 'anonymous',
      event,
      reason,
      timestamp,
      userAgent,
      url,
      ip: request.headers.get('x-forwarded-for') || 
          request.headers.get('x-real-ip') || 
          'unknown'
    };

    // Store in Redis if user is logged in
    if (session?.user?.id) {
      // Store user-specific security events
      await redis.lpush(
        `security_logs:${session.user.id}`, 
        JSON.stringify(securityLog)
      );
      await redis.expire(`security_logs:${session.user.id}`, 30 * 24 * 60 * 60); // 30 days
    }

    // Store global security events for monitoring
    await redis.lpush('global_security_events', JSON.stringify(securityLog));
    await redis.expire('global_security_events', 7 * 24 * 60 * 60); // 7 days    // Count suspicious activities per IP
    const ipKey = `suspicious_ip:${securityLog.ip}`;
    await redis.incr(ipKey);
    await redis.expire(ipKey, 24 * 60 * 60); // 24 hours

    // If too many suspicious activities from same IP, flag it
    const suspiciousCount = await redis.get(ipKey);
    if (suspiciousCount && typeof suspiciousCount === 'string' && parseInt(suspiciousCount) > 10) {
      await redis.setex(`blocked_ip:${securityLog.ip}`, 24 * 60 * 60, 'true');
      console.warn(`🚨 IP ${securityLog.ip} flagged for excessive suspicious activity`);
    }

    console.log('🔒 Security event logged:', {
      userId: securityLog.userId,
      event: securityLog.event,
      reason: securityLog.reason
    });

    return NextResponse.json({ 
      success: true,
      message: 'Security event logged' 
    });
  } catch (error) {
    console.error('Security logging error:', error);
    return NextResponse.json({ 
      error: 'Failed to log security event' 
    }, { status: 500 });
  }
}

// GET endpoint to retrieve security logs (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }    // Check if user is admin (you may need to adjust this logic)
    const userKey = `user:${session.user.id}`;
    const userData = await redis.hgetall(userKey);
    
    if (!userData || Object.keys(userData).length === 0 || userData.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get recent security events
    const globalEvents = await redis.lrange('global_security_events', 0, 99);
    const events = globalEvents.map(event => JSON.parse(event));

    return NextResponse.json({
      events,
      total: events.length
    });
  } catch (error) {
    console.error('Error retrieving security logs:', error);
    return NextResponse.json({ 
      error: 'Failed to retrieve security logs' 
    }, { status: 500 });
  }
}
