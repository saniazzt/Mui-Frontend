'use client';

import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { signUp } from '../../context/jwt';
import { useAuthContext } from '../../hooks';
import { getErrorMessage } from '../../utils';
import { FormHead } from '../../components/form-head';
import { SignUpTerms } from '../../components/sign-up-terms';

// ----------------------------------------------------------------------

export const SignUpSchema = zod
  .object({
    username: zod.string().min(1, { message: 'Username is required!' }),
    email: zod
      .string()
      .min(1, { message: 'Email is required!' })
      .email({ message: 'Email must be a valid email address!' }),
    password: zod
      .string()
      .min(6, { message: 'Password must be at least 6 characters!' }),
    confirmPassword: zod.string().min(1, { message: 'Please confirm your password!' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match!',
    path: ['confirmPassword'],
  });

// ----------------------------------------------------------------------

export function JwtSignUpView() {
  const router = useRouter();
  const showPassword = useBoolean();
  const { checkUserSession } = useAuthContext();
  const [errorMessage, setErrorMessage] = useState(null);

  const defaultValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setError,
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    setErrorMessage(null);
    try {
      const { username, email, password, confirmPassword } = data;
      await signUp({ username, email, password, confirmPassword });
      await checkUserSession?.();
      router.refresh();
    } catch (error) {
      console.log("1")
      console.log("Full error:", error);
      console.log("error.response:", error?.response);
      console.log("error.response.data:", error?.response?.data);
      console.log("error keys:", Object.keys(error));
      console.log("error.toString():", error.toString());
      // Try to extract field errors from backend response
      if (error?.response?.data?.errors) {
        console.log("2")
        const errors = error.response.data.errors;
        // Map backend field names to frontend field names
        const fieldMap = {
          password1: 'password',
          password2: 'confirmPassword',
          // add more mappings if needed
        };
        Object.entries(errors).forEach(([field, messages]) => {
          const frontendField = fieldMap[field] || field;
          setError(frontendField, { type: 'manual', message: messages.join(' ') });
        });
      } else {
        // Fallback to general error message
        console.log("3")
        const feedbackMessage = getErrorMessage(error);
        setErrorMessage(feedbackMessage);
      }
    }
  });

  return (
    <>
      <FormHead
        title="Create a new account"
        description={
          <>
            Already have an account?{' '}
            <Link component={RouterLink} href={paths.auth.jwt.signIn} variant="subtitle2">
              Sign in
            </Link>
          </>
        }
        sx={{ textAlign: { xs: 'center', md: 'left' } }}
      />

      {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
          <Field.Text
            name="username"
            label="Username"
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <Field.Text
            name="email"
            label="Email address"
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <Field.Text
            name="password"
            label="Password"
            placeholder="6+ characters"
            type={showPassword.value ? 'text' : 'password'}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={showPassword.onToggle} edge="end">
                      <Iconify
                        icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            helperText={methods.formState.errors.password && (
              <span dangerouslySetInnerHTML={{ __html: methods.formState.errors.password.message }} />
            )}
          />

          <Field.Text
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Re-enter your password"
            type={showPassword.value ? 'text' : 'password'}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={showPassword.onToggle} edge="end">
                      <Iconify
                        icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            helperText={methods.formState.errors.confirmPassword && (
              <span dangerouslySetInnerHTML={{ __html: methods.formState.errors.confirmPassword.message }} />
            )}
          />

          <Button
            fullWidth
            color="inherit"
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            loadingIndicator="Creating account..."
          >
            Create account
          </Button>
        </Box>
      </Form>

      <SignUpTerms />
    </>
  );
}