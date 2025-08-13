'use client';

import { removeLastSlash } from 'minimal-shared/utils';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

const NAV_ITEMS = [
  {
    label: 'General',
    icon: <Iconify width={24} icon="solar:user-id-bold" />,
    href: paths.dashboard.preferences.account,
  },
  {
    label: 'Billing',
    icon: <Iconify width={24} icon="solar:bill-list-bold" />,
    href: `${paths.dashboard.preferences.account}/billing`,
  },
  {
    label: 'Notifications',
    icon: <Iconify width={24} icon="solar:bell-bing-bold" />,
    href: `${paths.dashboard.preferences.account}/notifications`,
  },
  {
    label: 'Social links',
    icon: <Iconify width={24} icon="solar:share-bold" />,
    href: `${paths.dashboard.preferences.account}/socials`,
  },
  {
    label: 'Security',
    icon: <Iconify width={24} icon="ic:round-vpn-key" />,
    href: `${paths.dashboard.preferences.account}/change-password`,
  },
];

// ----------------------------------------------------------------------

export function AccountLayout({ children, ...other }) {
  const pathname = usePathname();

  return (
    <DashboardContent {...other}>
      <CustomBreadcrumbs
        heading="Account"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Preferences', href: paths.dashboard.preferences.account },
          { name: 'Account' },
        ]}
        sx={{ mb: 3 }}
      />

      <Tabs value={removeLastSlash(pathname)} sx={{ mb: { xs: 3, md: 5 } }}>
        {NAV_ITEMS.map((tab) => (
          <Tab
            component={RouterLink}
            key={tab.href}
            label={tab.label}
            icon={tab.icon}
            value={tab.href}
            href={tab.href}
          />
        ))}
      </Tabs>

      {children}
    </DashboardContent>
  );
}
