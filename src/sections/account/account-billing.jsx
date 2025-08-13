import Grid from '@mui/material/Grid';

import { AccountBillingPlan } from './account-billing-plan';
import { AccountBillingPayment } from './account-billing-payment';
import { AccountBillingHistory } from './account-billing-history';
import { AccountBillingAddress } from './account-billing-address';

// ----------------------------------------------------------------------

export function AccountBilling({ cards, plans, invoices, addressBook }) {
  return (
    <Grid container spacing={5}>
      <Grid size={{ xs: 12, md: 8 }}>
        <AccountBillingPlan plans={plans} cardList={cards} addressBook={addressBook} />
        <AccountBillingPayment cards={cards} />
        <AccountBillingAddress addressBook={addressBook} />
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <AccountBillingHistory invoices={invoices} />
      </Grid>
    </Grid>
  );
}
