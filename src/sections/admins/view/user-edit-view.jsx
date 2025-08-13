'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UserCreateEditForm } from '../user-create-edit-form';

// ----------------------------------------------------------------------

export function UserEditView({ user: currentAdmin }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.admins.list}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Admins', href: paths.dashboard.admins.root },
          { name: currentAdmin?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UserCreateEditForm currentUser={currentAdmin} />
    </DashboardContent>
  );
}
