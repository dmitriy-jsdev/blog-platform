import { useState, useEffect, type KeyboardEvent } from 'react';
import { useForm, type FieldErrors } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getArticle } from '../../app/store/actions/getArticles';
import { updateArticle } from '../../app/store/actions/updateArticle';
import Input from '../../shared/ui/Input/Input';
import Spinner from '../../shared/ui/Spinner/Spinner';
import NotFound from '../NotFound/NotFound';
import type { AppDispatch, RootState } from '../../app/store/store';
import styles from './EditArticle.module.css';

type Tag = { id: number; value: string };

type FormValues = {
  title: string;
  shortDescription: string;
  text: string;
};

type EditArticleStatus = 'loading' | 'loaded' | 'notFound' | 'error';

const EditArticle = (): JSX.Element => {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [pageStatus, setPageStatus] = useState<EditArticleStatus>('loading');
  const [pageError, setPageError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [editableTags, setEditableTags] = useState<Tag[]>([]);
  const [newTag, setNewTag] = useState<string>('');

  const user = useSelector((state: RootState) => state.user.user);
  const token = useSelector((state: RootState) => state.user.user?.token);

  const originalArticle = useSelector((state: RootState) =>
    state.articles.articlesData.articles.find(
      (article) => article.slug === slug,
    ),
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: '',
      shortDescription: '',
      text: '',
    },
  });

  useEffect(() => {
    if (!user) {
      navigate('/sign-in');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!slug) {
      setPageStatus('notFound');
      return;
    }

    setPageStatus('loading');
    setPageError(null);
    setSubmitError(null);
    window.scrollTo(0, 0);

    dispatch(getArticle(slug)).then((result) => {
      if (result.ok) {
        setPageStatus('loaded');
        return;
      }

      if (result.notFound) {
        setPageStatus('notFound');
        return;
      }

      setPageStatus('error');
      setPageError(result.error);
    });
  }, [dispatch, slug]);

  useEffect(() => {
    if (!originalArticle) return;

    reset({
      title: originalArticle.title ?? '',
      shortDescription: originalArticle.description ?? '',
      text: originalArticle.body ?? '',
    });
    setEditableTags(
      originalArticle.tagList?.map((tag, index) => ({
        id: index + 1,
        value: tag,
      })) ?? [],
    );
  }, [originalArticle, reset]);

  const handleTagChange = (id: number, newValue: string) => {
    const updatedTags = editableTags.map((tag) =>
      tag.id === id ? { ...tag, value: newValue } : tag,
    );
    setEditableTags(updatedTags);
  };

  const handleTagDelete = (idToDelete: number) => {
    setEditableTags((prev) => prev.filter((tag) => tag.id !== idToDelete));
  };

  const addTag = () => {
    if (newTag.trim() !== '') {
      const newId = Date.now();
      const newTagObject: Tag = { id: newId, value: newTag };
      setEditableTags((prev) => [...prev, newTagObject]);
      setNewTag('');
    }
  };

  const handleTagAddKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleTagBlur = (id: number, value: string) => {
    if (!value.trim()) handleTagDelete(id);
  };

  const onSubmit = async (data: FormValues) => {
    if (!slug) return;

    const articleData = {
      title: data.title,
      description: data.shortDescription,
      body: data.text,
      tagList: editableTags.map((tag) => tag.value),
    };

    setSubmitError(null);
    const result = await dispatch(updateArticle(slug, articleData, token));
    if (!result.ok) {
      setSubmitError(result.error);
      return;
    }

    navigate(`/articles/${slug}`);
  };

  if (pageStatus === 'loading') return <Spinner />;
  if (pageStatus === 'notFound') return <NotFound />;
  if (pageStatus === 'error') {
    return (
      <div className={styles.errorMessage}>
        {pageError ?? 'Error! No data received!'}
      </div>
    );
  }
  if (!originalArticle) return <Spinner />;

  return (
    <form
      className={styles.articleForm}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className={styles.header}>Edit article</div>

      <Input<FormValues>
        label="Title"
        type="text"
        name="title"
        placeholder="Title"
        register={register}
        rules={{
          required: 'Title is required',
          minLength: {
            value: 2,
            message: 'Title must be 2-250 characters long',
          },
          maxLength: {
            value: 250,
            message: 'Title must be 2-250 characters long',
          },
        }}
        error={(errors as FieldErrors<FormValues>).title}
      />

      <Input<FormValues>
        label="Short description"
        type="text"
        name="shortDescription"
        placeholder="Short description"
        register={register}
        rules={{
          required: 'Short description is required',
          minLength: {
            value: 3,
            message: 'Short description must be 3-250 characters long',
          },
          maxLength: {
            value: 250,
            message: 'Short description must be 3-250 characters long',
          },
        }}
        error={(errors as FieldErrors<FormValues>).shortDescription}
      />

      <div className={styles.formGroup}>
        <label htmlFor="text" className={styles.label}>
          Text
          <textarea
            className={`${styles.formGroupTextarea} ${
              (errors as FieldErrors<FormValues>).text
                ? styles.textareaError
                : ''
            }`}
            id="text"
            {...register('text', {
              required: 'Text is required',
              minLength: {
                value: 3,
                message: 'Text must be 3-2000 characters long',
              },
              maxLength: {
                value: 2000,
                message: 'Text must be 3-2000 characters long',
              },
            })}
            placeholder="Text"
            required
          />
        </label>
        {(errors as FieldErrors<FormValues>).text && (
          <span className={styles.errorMessage}>
            {(errors as FieldErrors<FormValues>).text?.message as string}
          </span>
        )}
      </div>

      <div className={`${styles.formGroup} ${styles.tags}`}>
        <label htmlFor="tags" className={styles.label}>
          Tags
          {editableTags.map((tag) => (
            <div className={styles.tag} key={tag.id}>
              <input
                className={`${styles.formGroupInput} ${styles.tagInput}`}
                id="tags"
                value={tag.value}
                onChange={(e) => handleTagChange(tag.id, e.target.value)}
                onBlur={(e) => handleTagBlur(tag.id, e.target.value)}
                placeholder="Tag"
              />
              <button
                type="button"
                className={styles.tagDelete}
                onClick={() => handleTagDelete(tag.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </label>

        <div className={styles.formAddTags}>
          <input
            className={`${styles.formGroupInput} ${styles.tagInput} ${styles.tagInputAdd}`}
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleTagAddKeyPress}
            placeholder="Tag"
          />
          <button
            type="button"
            className={styles.tagDelete}
            onClick={() => setNewTag('')}
          >
            Delete
          </button>
          <button type="button" className={styles.tagAdd} onClick={addTag}>
            Add Tag
          </button>
        </div>
      </div>

      <button type="submit" className={styles.submitBtn}>
        Send
      </button>

      {submitError && (
        <span className={styles.errorMessage}>{submitError}</span>
      )}
    </form>
  );
};

export default EditArticle;
