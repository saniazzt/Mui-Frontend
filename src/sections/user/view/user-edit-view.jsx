'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UserCreateEditForm } from '../user-create-edit-form';

// ----------------------------------------------------------------------

export function UserEditView({ user: currentUser }) {
  console.log('Fetched user2:', currentUser);
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.users.list}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Users', href: paths.dashboard.users.root },
          { name: currentUser?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UserCreateEditForm currentUser={currentUser} />
    </DashboardContent>
  );
}
