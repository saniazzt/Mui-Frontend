import { useId, useMemo, useCallback } from 'react';

import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import { filledInputClasses } from '@mui/material/FilledInput';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import InputAdornment, { inputAdornmentClasses } from '@mui/material/InputAdornment';

import { countries } from 'src/assets/data';

import { FlagIcon } from '../flag-icon';

// ----------------------------------------------------------------------

const getCountry = (inputValue) =>
  countries.find(
    (country) =>
      country.label === inputValue || country.code === inputValue || country.phone === inputValue
  ) ?? {
    code: '',
    label: '',
    phone: '',
  };

export function CountrySelect({
  id,
  label,
  error,
  variant,
  multiple,
  slotProps,
  helperText,
  hiddenLabel,
  placeholder,
  displayValue = 'label',
  ...other
}) {
  const uniqueId = useId();

  const options = useMemo(
    () => countries.map((country) => (displayValue === 'code' ? country.code : country.label)),
    [displayValue]
  );

  const getOptionLabel = useCallback(
    (option) => (displayValue === 'code' ? getCountry(option).label : option),
    [displayValue]
  );

  const renderOption = useCallback((props, option) => {
    const { key, ...otherProps } = props;
    const country = getCountry(option);

    return (
      <li key={key} {...otherProps}>
        <FlagIcon
          code={country.code}
          sx={{
            mr: 1,
            width: 22,
            height: 22,
            borderRadius: '50%',
          }}
        />
        {country.label} ({country.code}) +{country.phone}
      </li>
    );
  }, []);

  const renderInput = useCallback(
    (params) => {
      const country = getCountry(params.inputProps.value);
      const hasAdornment = !multiple && !!country.code;

      const textFieldStyles = {
        [`& .${inputAdornmentClasses.root}`]: {
          ml: 0.5,
          mr: 1,
        },
        [`& .${outlinedInputClasses.root}, .${filledInputClasses.root}`]: {
          [`& .${autocompleteClasses.input}`]: {
            pl: 0,
          },
        },
        [`& .${filledInputClasses.root}`]: {
          [`& .${inputAdornmentClasses.root}`]: {
            transform: hiddenLabel ? 'unset' : 'translateY(-8px)',
          },
        },
      };

      const textFieldSlotProps = {
        ...slotProps?.textField?.slotProps,
        htmlInput: {
          ...params.inputProps,
          ...slotProps?.textField?.slotProps?.htmlInput,
          autoComplete: 'new-password', // Disable autocomplete and autofill
        },
        input: {
          ...params.InputProps,
          ...slotProps?.textField?.slotProps?.input,
          ...(hasAdornment && {
            startAdornment: (
              <InputAdornment position="start">
                <FlagIcon code={country.code} sx={{ width: 22, height: 22, borderRadius: '50%' }} />
              </InputAdornment>
            ),
          }),
        },
      };

      return (
        <TextField
          {...params}
          label={label}
          variant={variant}
          placeholder={placeholder}
          helperText={helperText}
          hiddenLabel={hiddenLabel}
          error={!!error}
          {...slotProps?.textField}
          slotProps={textFieldSlotProps}
          sx={[
            !multiple && textFieldStyles,
            ...(Array.isArray(slotProps?.textField?.sx)
              ? slotProps.textField.sx
              : [slotProps?.textField?.sx]),
          ]}
        />
      );
    },
    [error, helperText, hiddenLabel, label, multiple, placeholder, slotProps?.textField, variant]
  );

  const renderValue = useCallback(
    (selected, getItemProps) =>
      selected.map((option, index) => {
        const country = getCountry(option);

        return (
          <Chip
            {...getItemProps({ index })}
            key={country.label}
            label={country.label}
            size="small"
            variant="soft"
            icon={
              <FlagIcon code={country.code} sx={[{ width: 16, height: 16, borderRadius: '50%' }]} />
            }
            {...slotProps?.chip}
          />
        );
      }),
    [slotProps?.chip]
  );

  return (
    <Autocomplete
      id={id ?? `${uniqueId}-country-select`}
      options={options}
      multiple={multiple}
      autoHighlight={!multiple}
      disableCloseOnSelect={multiple}
      getOptionLabel={getOptionLabel}
      renderOption={renderOption}
      renderInput={renderInput}
      renderValue={multiple ? renderValue : undefined}
      {...slotProps}
      {...other}
    />
  );
}
