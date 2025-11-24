import { FeaturesEnum, PermissionEnum, RoleEnum } from './enum.constant';

export const rolePermissionData = [
  // ================== Admin ==================
  {
    role: RoleEnum.Admin,
    featureName: FeaturesEnum.Dashboard,
    permission: [PermissionEnum.View],
  },
  {
    role: RoleEnum.Admin,
    featureName: FeaturesEnum.DashboardMatrices,
    permission: [PermissionEnum.View],
  },
  {
    role: RoleEnum.Admin,
    featureName: FeaturesEnum.User,
    permission: [PermissionEnum.View, PermissionEnum.Update, PermissionEnum.Delete],
  },
  {
    role: RoleEnum.Admin,
    featureName: FeaturesEnum.Users,
    permission: [PermissionEnum.View],
  },
  {
    role: RoleEnum.Admin,
    featureName: FeaturesEnum.Event,
    permission: [PermissionEnum.Create, PermissionEnum.Update, PermissionEnum.Delete, PermissionEnum.View],
  },
  {
    role: RoleEnum.Admin,
    featureName: FeaturesEnum.EventCategory,
    permission: [PermissionEnum.Create, PermissionEnum.Update, PermissionEnum.Delete, PermissionEnum.View],
  },
  {
    role: RoleEnum.Admin,
    featureName: FeaturesEnum.EventMedia,
    permission: [PermissionEnum.View, PermissionEnum.Delete],
  },
  {
    role: RoleEnum.Admin,
    featureName: FeaturesEnum.Booking,
    permission: [PermissionEnum.View, PermissionEnum.Delete],
  },
  {
    role: RoleEnum.Admin,
    featureName: FeaturesEnum.Seat,
    permission: [PermissionEnum.View, PermissionEnum.Update],
  },
  {
    role: RoleEnum.Admin,
    featureName: FeaturesEnum.SeatLayout,
    permission: [PermissionEnum.Create, PermissionEnum.Update, PermissionEnum.Delete, PermissionEnum.View],
  },
  {
    role: RoleEnum.Admin,
    featureName: FeaturesEnum.Ticket,
    permission: [PermissionEnum.View, PermissionEnum.Delete],
  },
  {
    role: RoleEnum.Admin,
    featureName: FeaturesEnum.Payment,
    permission: [PermissionEnum.View],
  },
  {
    role: RoleEnum.Admin,
    featureName: FeaturesEnum.Transaction,
    permission: [PermissionEnum.View],
  },
  {
    role: RoleEnum.Admin,
    featureName: FeaturesEnum.Wallet,
    permission: [PermissionEnum.View, PermissionEnum.Update],
  },
  {
    role: RoleEnum.Admin,
    featureName: FeaturesEnum.Notification,
    permission: [PermissionEnum.View, PermissionEnum.Create, PermissionEnum.Delete],
  },
  {
    role: RoleEnum.Admin,
    featureName: FeaturesEnum.Chat,
    permission: [PermissionEnum.View],
  },
  {
    role: RoleEnum.Admin,
    featureName: FeaturesEnum.Organization,
    permission: [PermissionEnum.View, PermissionEnum.Update, PermissionEnum.Delete],
  },
  {
    role: RoleEnum.Admin,
    featureName: FeaturesEnum.Reports,
    permission: [PermissionEnum.View],
  },
  {
    role: RoleEnum.Admin,
    featureName: FeaturesEnum.Analytics,
    permission: [PermissionEnum.View],
  },
  {
    role: RoleEnum.Admin,
    featureName: FeaturesEnum.AuditLog,
    permission: [PermissionEnum.View],
  },
  {
    role: RoleEnum.Admin,
    featureName: FeaturesEnum.Setting,
    permission: [PermissionEnum.View, PermissionEnum.Update],
  },
  {
    role: RoleEnum.Admin,
    featureName: FeaturesEnum.Integration,
    permission: [PermissionEnum.View, PermissionEnum.Update],
  },
  {
    role: RoleEnum.Admin,
    featureName: FeaturesEnum.Calendar,
    permission: [PermissionEnum.Create, PermissionEnum.Update, PermissionEnum.Delete, PermissionEnum.View],
  },

  // ================== Organization ==================
  {
    role: RoleEnum.Organization,
    featureName: FeaturesEnum.Event,
    permission: [PermissionEnum.Create, PermissionEnum.Update, PermissionEnum.View],
  },
  {
    role: RoleEnum.Organization,
    featureName: FeaturesEnum.Calendar,
    permission: [PermissionEnum.View],
  },
  {
    role: RoleEnum.Organization,
    featureName: FeaturesEnum.EventCategory,
    permission: [PermissionEnum.View, PermissionEnum.Create, PermissionEnum.Update],
  },
  {
    role: RoleEnum.Organization,
    featureName: FeaturesEnum.EventMedia,
    permission: [PermissionEnum.View, PermissionEnum.Create, PermissionEnum.Delete],
  },
  {
    role: RoleEnum.Organization,
    featureName: FeaturesEnum.SeatLayout,
    permission: [PermissionEnum.Create, PermissionEnum.Update, PermissionEnum.View],
  },
  {
    role: RoleEnum.Organization,
    featureName: FeaturesEnum.Booking,
    permission: [PermissionEnum.View],
  },
  {
    role: RoleEnum.Organization,
    featureName: FeaturesEnum.Payment,
    permission: [PermissionEnum.View],
  },
  {
    role: RoleEnum.Organization,
    featureName: FeaturesEnum.Transaction,
    permission: [PermissionEnum.View],
  },
  {
    role: RoleEnum.Organization,
    featureName: FeaturesEnum.Notification,
    permission: [PermissionEnum.View, PermissionEnum.Create],
  },
  {
    role: RoleEnum.Organization,
    featureName: FeaturesEnum.Reports,
    permission: [PermissionEnum.View],
  },
  {
    role: RoleEnum.Organization,
    featureName: FeaturesEnum.Analytics,
    permission: [PermissionEnum.View],
  },

  // ================== User ==================
  {
    role: RoleEnum.User,
    featureName: FeaturesEnum.Event,
    permission: [PermissionEnum.View],
  },
  {
    role: RoleEnum.User,
    featureName: FeaturesEnum.Calendar,
    permission: [PermissionEnum.View],
  },
  {
    role: RoleEnum.User,
    featureName: FeaturesEnum.EventCategory,
    permission: [PermissionEnum.View],
  },
  {
    role: RoleEnum.User,
    featureName: FeaturesEnum.Booking,
    permission: [PermissionEnum.Create, PermissionEnum.View, PermissionEnum.Delete],
  },
  {
    role: RoleEnum.User,
    featureName: FeaturesEnum.Seat,
    permission: [PermissionEnum.View],
  },
  {
    role: RoleEnum.User,
    featureName: FeaturesEnum.Ticket,
    permission: [PermissionEnum.View, PermissionEnum.Delete],
  },
  {
    role: RoleEnum.User,
    featureName: FeaturesEnum.Payment,
    permission: [PermissionEnum.Create, PermissionEnum.View],
  },
  {
    role: RoleEnum.User,
    featureName: FeaturesEnum.Transaction,
    permission: [PermissionEnum.View],
  },
  {
    role: RoleEnum.User,
    featureName: FeaturesEnum.Wallet,
    permission: [PermissionEnum.View, PermissionEnum.Update],
  },
  {
    role: RoleEnum.User,
    featureName: FeaturesEnum.Notification,
    permission: [PermissionEnum.View],
  },
  {
    role: RoleEnum.User,
    featureName: FeaturesEnum.Chat,
    permission: [PermissionEnum.Create, PermissionEnum.View],
  },
  {
    role: RoleEnum.User,
    featureName: FeaturesEnum.Profile,
    permission: [PermissionEnum.View, PermissionEnum.Update],
  },
];
