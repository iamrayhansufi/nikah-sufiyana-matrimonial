import { redis } from "./redis-client";
import { database } from "./database-service";
import { type User } from "./types";

export interface UserReportEntry {
  name: string
  email: string | null | undefined
  phone: string
  age: number
  location: string
  education: string
  profession: string | null | undefined
  subscription: string
  status: string
  joinedDate: string
}

export interface RevenueReportEntry {
  month: string
  revenue: number
  subscriptions: number
}

export interface ActivityReportEntry {
  dailyRegistrations: Array<{
    date: string
    registrations: number
  }>
  statusBreakdown: Array<{
    status: string
    count: number
  }>
}

export async function generateUserReport(startDate?: string, endDate?: string): Promise<UserReportEntry[]> {
  const allUsers = await database.users.getUsers(1, 1000);

  // Filter users by date if provided
  let users = allUsers;
  if (startDate || endDate) {
    users = allUsers.filter((user: User) => {
      if (!user.createdAt) return false;
      const createdAt = new Date(user.createdAt);
      if (startDate && createdAt < new Date(startDate)) return false;
      if (endDate && createdAt > new Date(endDate)) return false;
      return true;
    });
  }

  return users.map((user: User) => ({
    name: user.fullName || '',
    email: user.email,
    phone: user.phone || '',
    age: user.age || 0,
    location: user.location || '',
    education: user.education || '',
    profession: user.profession,
    subscription: user.subscription || '',
    status: user.profileStatus || '',
    joinedDate: user.createdAt ? new Date(user.createdAt).toISOString().split("T")[0] : '',
  }))
}

export async function generateRevenueReport(startDate?: string, endDate?: string): Promise<RevenueReportEntry[]> {
  // For now, return static data
  // TODO: Implement actual revenue calculation from database
  return [
    { month: "January 2024", revenue: 245000, subscriptions: 312 },
    { month: "February 2024", revenue: 267000, subscriptions: 345 },
    { month: "March 2024", revenue: 289000, subscriptions: 378 },
  ]
}

export async function generateActivityReport(startDate?: string, endDate?: string): Promise<ActivityReportEntry> {
  const allUsers = await database.users.getUsers(1, 1000);

  // Filter users by date if provided
  let users = allUsers;
  if (startDate || endDate) {
    users = allUsers.filter((user: User) => {
      if (!user.createdAt) return false;
      const createdAt = new Date(user.createdAt);
      if (startDate && createdAt < new Date(startDate)) return false;
      if (endDate && createdAt > new Date(endDate)) return false;
      return true;
    });
  }

  // Process daily registrations
  const dailyRegistrations = users.reduce((acc: Record<string, number>, user: User) => {
    const date = user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : 'unknown';
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  // Process status breakdown
  const statusBreakdown = users.reduce((acc: Record<string, number>, user: User) => {
    const status = user.profileStatus || 'unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  return {
    dailyRegistrations: Object.entries(dailyRegistrations).map(([date, count]) => ({
      date,
      registrations: count as number,
    })),
    statusBreakdown: Object.entries(statusBreakdown).map(([status, count]) => ({
      status,
      count: count as number,
    })),
  }
}
