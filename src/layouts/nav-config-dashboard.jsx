import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

import { useAuthContext } from 'src/auth/hooks/use-auth-context';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  params: icon('ic-params'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  subpaths: icon('ic-subpaths'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
};

// ----------------------------------------------------------------------

export function GetNavDataByRole() {
  // Shared options
  const { user } = useAuthContext();

  const sharedItems = [
  {
    subheader: 'Overview',
    items: [
      {
        title: 'One',
        path: paths.dashboard.root,
        icon: ICONS.dashboard,
        info: <Label>v{CONFIG.appVersion}</Label>,
      },
      { title: 'Two', path: paths.dashboard.two, icon: ICONS.ecommerce },
      { title: 'Three', path: paths.dashboard.three, icon: ICONS.analytics },
    ],
  },
  {
      items: [
        {
        title: 'Preferences',
        path: paths.dashboard.preferences.root,
        icon: ICONS.menuItem,
        children: [
          // { title: 'Profile', path: paths.dashboard.user.root },
          // { title: 'Cards', path: paths.dashboard.user.cards },
          // { title: 'Create', path: paths.dashboard.user.new },
          { title: 'Account', path: paths.dashboard.preferences.account, deepMatch: true },
        ],
      }
      ]
    },
  ];

  // Role-specific options

  // const userItems = [
  //   ...sharedItems,
  //   {
  //     title: 'User Profile',
  //     path: paths.dashboard.profile,
  //     icon: ICONS.user,
  //   },
  //   // ...other user-only items
  // ];

  const adminItems = [
      ...sharedItems,
    {
      subheader: 'Management',
      items: [
        {
          title: 'Users',
          path: paths.dashboard.users.root,
          icon: ICONS.user,
          children: [            
            { title: 'List', path: paths.dashboard.users.root },
            // { title: 'Edit', path: paths.dashboard.users.demo.edit },
          ],
        },
      ],
    },
  ];

  const superAdminItems = [
    ...adminItems,
    {
      subheader: 'Super Management',
      items: [
        {
          title: 'Admins',
          path: paths.dashboard.admins.root,
          icon: ICONS.job,
          children: [
            { title: 'List', path: paths.dashboard.admins.list },
            { title: 'Create', path: paths.dashboard.admins.new },
          ],
        },
      ],
    },
    // ...other superadmin-only items
  ];

  if (user?.user_type === 'admin') return adminItems;
  if (user?.user_type === 'superadmin') return superAdminItems;
  return sharedItems; // default to user
}