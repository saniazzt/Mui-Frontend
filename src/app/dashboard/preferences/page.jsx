import { CONFIG } from 'src/global-config';

import { AccountGeneralView } from 'src/sections/account/view';

// ----------------------------------------------------------------------

export const metadata = { title: `User list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <AccountGeneralView />;
}
