import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { USER_STATUS_OPTIONS } from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { JWT_STORAGE_KEY } from 'src/auth/context/jwt/constant';
import axios, { endpoints } from 'src/lib/axios';
import { useAuthContext } from 'src/auth/hooks';
import { check } from 'prettier';


// ----------------------------------------------------------------------

export const UserQuickEditSchema = zod.object({
  name: zod.string().optional(),
  email: zod.string().email({ message: 'Email must be a valid email address!' }).optional(),
  phoneNumber: zod
  .string()
  .optional()
  .refine((val) => !val || isValidPhoneNumber(val), {
    message: 'Phone number is invalid',
  }),
  country: schemaHelper.nullableInput(zod.string().optional(), {
    message: 'Country is required!',
  }).optional(),
  state: zod.string().optional(),
  city: zod.string().optional(),
  address: zod.string().optional(),
  zipCode: zod.string().optional(),
  company: zod.string().optional(),
  role: zod.string().optional(),
  status: zod.string().optional(),
});

// ----------------------------------------------------------------------

export function UserQuickEditForm({ currentUser, open, onClose }) {

  const { user, checkUserSession } = useAuthContext();

  const defaultValues = {
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    country: null,
    state: '',
    city: '',
    zipCode: '',
    status: '',
    company: '',
    role: '',
  };

  const initialValues = { ...defaultValues, ...currentUser };

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(UserQuickEditSchema),
    defaultValues: initialValues,
    });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const promise = new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const accessToken = sessionStorage.getItem(JWT_STORAGE_KEY);

      const res = await axios.put(
        endpoints.users.update(currentUser.id),
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          },
        }
      );

      if (res.data.success === true) {
        reset();
        onClose();
        window.location.reload();
      } else {
        toast.error('Failed to update profile');
      }

      // toast.promise(promise, {
      //   loading: 'Loading...',
      //   success: 'Update success!',
      //   error: 'Update error!',
      // });

      // await promise;

      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { maxWidth: 720 },
        },
      }}
    >
      <DialogTitle>Quick update</DialogTitle>

      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            Account is waiting for confirmation
          </Alert>

          <Box
            sx={{
              rowGap: 3,
              columnGap: 2,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
            }}
          >
            <Field.Select name="status" label="Status">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>

            <Box sx={{ display: { xs: 'none', sm: 'block' } }} />

            <Field.Text name="name" label="Full name" />
            <Field.Text name="email" label="Email address" />
            <Field.Phone name="phoneNumber" label="Phone number" />

            <Field.CountrySelect
              fullWidth
              name="country"
              label="Country"
              placeholder="Choose a country"
            />

            <Field.Text name="state" label="State/region" />
            <Field.Text name="city" label="City" />
            <Field.Text name="address" label="Address" />
            <Field.Text name="zipCode" label="Zip/code" />
            <Field.Text name="company" label="Company" />
            {user?.user_type === 'superadmin' && (
              <Field.Text name="role" label="Role" />
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" loading={isSubmitting}>
            Update
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
