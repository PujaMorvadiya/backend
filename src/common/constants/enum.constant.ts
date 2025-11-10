export enum FeaturesEnum {
  Permission = 'Permission',
  RolePermission = 'RolePermission',
  Feature = 'Feature',
  Role = 'Role',
  User = 'User',
  Users = 'Users',
  Profile = 'Profile',
  Dashboard = 'Dashboard',
  DashboardMatrices = 'DashboardMatrices',
  Event = 'Event',
  EventCategory = 'EventCategory',
  EventMedia = 'EventMedia',
  Booking = 'Booking',
  Seat = 'Seat',
  SeatLayout = 'SeatLayout',
  Ticket = 'Ticket',
  Payment = 'Payment',
  Transaction = 'Transaction',
  Wallet = 'Wallet',
  Notification = 'Notification',
  Chat = 'Chat',
  Admin = 'Admin',
  Organization = 'Organization',
  Reports = 'Reports',
  Analytics = 'Analytics',
  Setting = 'Setting',
  AuditLog = 'AuditLog',
  Integration = 'Integration',
}

export enum PermissionEnum {
  Update = 'Update',
  Delete = 'Delete',
  Create = 'Create',
  View = 'View',
}

export enum RoleEnum {
  Admin = 'Admin',
  Organization = 'Organization',
  User = 'User',
}

export enum AuditLogs {
  REGISTER = 'User Register',
  LOGIN = 'User Login Success',
  LOGOUT = 'User Logout Success',
}