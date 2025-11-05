import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../../app/store/actions/updateUser';
import Input from '../../shared/ui/Input/Input';
import type { AppDispatch } from '../../app/store/store';
import styles from './EditProfile.module.css';

type FormValues = {
  username: string;
  email: string;
  password?: string;
  avatar?: string;
};

type RootStatePart = {
  user: {
    user: {
      username?: string;
      email?: string;
      token?: string;
      image?: string | null;
    } | null;
    error?: unknown;
  };
};

const EditProfile = (): JSX.Element => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      avatar: '',
    },
  });
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootStatePart) => state.user.user);
  const token = useSelector((state: RootStatePart) => state.user.user?.token);
  const serverError = useSelector((state: RootStatePart) => state.user.error);

  const urlPattern = new RegExp(
    '^' +
      '(https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|' +
      'www\\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|' +
      'https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9]+\\.[^\\s]{2,}|' +
      'www\\.[a-zA-Z0-9]+\\.[^\\s]{2,})$',
  );

  useEffect(() => {
    reset({
      username: user?.username ?? '',
      email: user?.email ?? '',
      password: '',
      avatar: user?.image ?? '',
    });
  }, [reset, user]);

  const onSubmit = async (data: FormValues) => {
    const avatar = data.avatar?.trim();
    const ok = await dispatch(
      updateUser(
        data.username.trim(),
        data.email.trim(),
        data.password?.trim() || undefined,
        avatar || undefined,
        token,
      ),
    );
    if (ok) {
      window.scrollTo(0, 0);
      navigate('/');
    }
  };

  return (
    <div className={styles.profileEdit}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={styles.header}>Edit Profile</div>

        <Input<FormValues>
          label="Username"
          type="text"
          name="username"
          placeholder="Username"
          register={register}
          rules={{
            required: 'Username is required',
            minLength: {
              value: 3,
              message: 'Username must be 3-20 characters long',
            },
            maxLength: {
              value: 20,
              message: 'Username must be 3-20 characters long',
            },
          }}
          error={errors.username}
        />

        <Input<FormValues>
          label="Email address"
          type="email"
          name="email"
          placeholder="Email address"
          register={register}
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: 'Invalid email format',
            },
          }}
          error={errors.email}
        />

        <Input<FormValues>
          label="New password"
          type="password"
          name="password"
          placeholder="New password"
          register={register}
          rules={{
            minLength: {
              value: 6,
              message: 'Your password needs to be at least 6 characters',
            },
          }}
          error={errors.password}
        />

        <Input<FormValues>
          label="Avatar image URL (optional)"
          type="text"
          name="avatar"
          placeholder="https://example.com/avatar.jpg"
          register={register}
          rules={{
            validate: (value) =>
              !value || urlPattern.test(value) || 'Invalid URL',
          }}
          error={errors.avatar}
        />

        <button type="submit" className={styles.btn}>
          Save
        </button>

        {typeof serverError === 'string' && (
          <div className={styles.errorMessage}>{serverError}</div>
        )}
      </form>
    </div>
  );
};

export default EditProfile;
