import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';
import { toast } from 'src/components/snackbar';

import { Label } from 'src/components/label';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import axios, { endpoints } from 'src/lib/axios';
import { JWT_STORAGE_KEY } from 'src/auth/context/jwt/constant';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export const UserCreateSchema = zod.object({
  avatarUrl: zod.any().optional(),
  name: zod.string().optional(),
  username: zod.string().optional(),
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
  // Not required
  status: zod.string(),
  isVerified: zod.boolean(),
});

// ----------------------------------------------------------------------

export function UserCreateEditForm({ currentUser }) {

  const { user, checkUserSession } = useAuthContext();

  const router = useRouter();

  const defaultValues = {
    status: '',
    // avatarUrl: null,
    isVerified: true,
    name: '',
    email: '',
    phoneNumber: '',
    country: null,
    state: '',
    city: '',
    address: '',
    zipCode: '',
    company: '',
    role: '',
    username: '',
  };

  
  const safeCurrentUser = currentUser
    ? Object.fromEntries(
        Object.entries(currentUser).map(([key, value]) => [key, value ?? ""])
      )
    : {};

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(UserCreateSchema),
    defaultValues,
    values: { ...defaultValues, ...safeCurrentUser },
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

const onSubmit = handleSubmit(async (formData) => {
  try {
    console.log('Form Data:', formData);
    const accessToken = sessionStorage.getItem(JWT_STORAGE_KEY);

    const res = await axios.put(
      endpoints.users.update(currentUser.id),
      { ...formData, avatarUrl: null },
      {
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      }
    );

    if (res.data.success === true) {
      reset();
      router.push(paths.dashboard.users.list);
      toast.success(currentUser ? 'Update success!' : 'Create success!');
    } else {
      toast.error('Failed to update profile');
    }
  } catch (error) {
    console.error(error);
    toast.error('Something went wrong');
  }
});


  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            {currentUser && (
              <Label
                color={
                  (values.status === 'active' && 'success') ||
                  (values.status === 'banned' && 'error') ||
                  'warning'
                }
                sx={{ position: 'absolute', top: 24, right: 24 }}
              >
                {values.status}
              </Label>
            )}

            {/* <Box sx={{ mb: 5 }}>
              <Field.UploadAvatar
                name="avatarUrl"
                maxSize={3145728}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box> */}

            {currentUser && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value !== 'active'}
                        onChange={(event) =>
                          field.onChange(event.target.checked ? 'banned' : 'active')
                        }
                      />
                    )}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Banned
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Apply disable account
                    </Typography>
                  </>
                }
                sx={{
                  mx: 0,
                  mb: 3,
                  width: 1,
                  justifyContent: 'space-between',
                }}
              />
            )}

            <Field.Switch
              name="isVerified"
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Email verified
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Disabling this will automatically send the user a verification email
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            />

            {currentUser && (
              <Stack sx={{ mt: 3, alignItems: 'center', justifyContent: 'center' }}>
                <Button variant="soft" color="error">
                  Delete user
                </Button>
              </Stack>
            )}
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <Field.Text name="name" label="Full name" />
              <Field.Text name="email" label="Email address" />
              <Field.Text name="username" label="Username" />
              <Field.Phone name="phoneNumber" label="Phone number" defaultCountry="US" />

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
              {(!currentUser || user?.user_type !== 'superadmin') ? (
                <></>
              ) : (
                <Field.Select name="role" label="Role" placeholder="Select a role">
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                </Field.Select>
              )}
            </Box>

            <Stack sx={{ mt: 3, alignItems: 'flex-end' }}>
              <Button type="submit" variant="contained" loading={isSubmitting}>
                {!currentUser ? 'Create admin' : 'Save changes'}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
