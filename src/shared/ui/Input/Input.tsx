import type { HTMLInputTypeAttribute } from 'react';
import type {
  FieldError,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';
import styles from './Input.module.css';

type InputProps<TFieldValues extends FieldValues = FieldValues> = {
  label: string;
  type?: HTMLInputTypeAttribute;
  register: UseFormRegister<TFieldValues>;
  name: Path<TFieldValues>;
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  placeholder?: string;
  defaultValue?: string | number | readonly string[] | null;
  error?: FieldError | null;
  inputStyle?: string;
  labelStyle?: string;
};

const Input = <TFieldValues extends FieldValues = FieldValues>({
  label,
  type = 'text',
  register,
  name,
  rules,
  placeholder = '',
  defaultValue = null,
  error = null,
  inputStyle = '',
  labelStyle = '',
}: InputProps<TFieldValues>): JSX.Element => (
  <div className={styles.formGroup}>
    <label htmlFor={String(name)} className={`${styles.label} ${labelStyle}`}>
      {label}
      <input
        type={type}
        className={`${styles.input} ${inputStyle} ${error ? styles.inputError : ''}`}
        id={String(name)}
        placeholder={placeholder}
        defaultValue={defaultValue ?? undefined}
        {...register(name, rules)}
      />
    </label>
    {error && <span className={styles.errorMessage}>{error.message}</span>}
  </div>
);

export default Input;
