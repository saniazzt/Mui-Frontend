import { CONFIG } from 'src/global-config';

import { UserCreateView } from 'src/sections/admins/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Create a new admin | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <UserCreateView />;
}
