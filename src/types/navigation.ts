import { UserRole } from './auth';

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  roles: UserRole[];
  children?: NavigationItem[];
}

export const navigationConfig: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    path: '/dashboard',
    roles: ['admin', 'doctor', 'nurse', 'pharmacist', 'lab_technician', 'receptionist']
  },
  {
    id: 'patients',
    label: 'Patient Management',
    icon: 'Users',
    path: '/patients',
    roles: ['admin', 'doctor', 'nurse', 'receptionist']
  },
  {
    id: 'appointments',
    label: 'Appointments',
    icon: 'Calendar',
    path: '/appointments',
    roles: ['admin', 'doctor', 'nurse', 'receptionist']
  },
  {
    id: 'pharmacy',
    label: 'Pharmacy',
    icon: 'Pill',
    path: '/pharmacy',
    roles: ['admin', 'pharmacist', 'doctor']
  },
  {
    id: 'laboratory',
    label: 'Laboratory',
    icon: 'TestTube',
    path: '/laboratory',
    roles: ['admin', 'lab_technician', 'doctor']
  },
  {
    id: 'staff',
    label: 'Staff Management',
    icon: 'UserCog',
    path: '/staff',
    roles: ['admin']
  },
  {
    id: 'financial',
    label: 'Financial Reports',
    icon: 'DollarSign',
    path: '/financial',
    roles: ['admin']
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: 'Bell',
    path: '/notifications',
    roles: ['admin', 'doctor', 'nurse', 'pharmacist', 'lab_technician', 'receptionist']
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'Settings',
    path: '/settings',
    roles: ['admin', 'doctor', 'nurse', 'pharmacist', 'lab_technician', 'receptionist']
  }
];