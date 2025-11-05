import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, clearError } from '../../app/store/actions/loginUser';
import Input from '../../shared/ui/Input/Input';
import type { AppDispatch, RootState } from '../../app/store/store';
import styles from './SignIn.module.css';

type FormValues = {
  email: string;
  password: string;
};

const SignIn = (): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state: RootState) => !!state.user.user);
  const authError = useSelector((state: RootState) => state.user.error);

  useEffect(() => {
    if (isAuthenticated) navigate('/');
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const onSubmit = (data: FormValues) => {
    dispatch(loginUser(data.email, data.password));
  };

  return (
    <div className={styles.signinForm}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={styles.header}>Sign In</div>

        <Input<FormValues>
          label="Email address"
          type="email"
          name="email"
          placeholder="Email address"
          register={register}
          rules={{
            required: 'This field is required',
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: 'Invalid email format',
            },
          }}
          error={errors.email ?? null}
        />

        <Input<FormValues>
          label="Password"
          type="password"
          name="password"
          placeholder="Password"
          register={register}
          rules={{
            required: 'This field is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
            maxLength: {
              value: 40,
              message: 'Password cannot exceed 40 characters',
            },
          }}
          error={errors.password ?? null}
        />

        {Boolean(authError) && (
          <div className={styles.errorMessage}>Wrong password or email</div>
        )}

        <button type="submit" className={styles.btn}>
          Login
        </button>

        <div className={styles.signUpText}>
          Don&apos;t have an account?{' '}
          <Link to="/sign-up" className={styles.signUpLink}>
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
