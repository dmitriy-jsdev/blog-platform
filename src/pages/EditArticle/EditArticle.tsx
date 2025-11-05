import {
  useState,
  useEffect,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react';
import { useForm, type FieldErrors } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createSelector } from 'reselect';
import { updateArticle } from '../../app/store/actions/updateArticle';
import Input from '../../shared/ui/Input/Input';
import type { AppDispatch } from '../../app/store/store';
import styles from './EditArticle.module.css';

type Tag = { id: number; value: string };

type ArticleItem = {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
};

type RootStatePart = {
  articles: {
    articlesData: { articles: ArticleItem[] };
  };
  user: { user: { token?: string } | null };
};

type FormValues = {
  title: string;
  shortDescription: string;
  text: string;
};

const EditArticle = (): JSX.Element => {
  const getArticles = (state: RootStatePart) =>
    state.articles.articlesData.articles;
  const getSlug = (_state: RootStatePart, slug: string) => slug;

  const originalArticleSelector = createSelector(
    [getArticles, getSlug],
    (articles, slug) => articles.find((article) => article.slug === slug),
  );

  const { slug } = useParams<{ slug: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const user = useSelector((state: RootStatePart) => state.user.user);
  const token = useSelector((state: RootStatePart) => state.user.user?.token);

  const originalArticle = useSelector((state: RootStatePart) =>
    originalArticleSelector(state, slug ?? ''),
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const [editableArticle, SetEditableArticle] = useState<{
    title: string;
    description: string;
    body: string;
    tags: Tag[];
  }>({
    title: originalArticle?.title ?? '',
    description: originalArticle?.description ?? '',
    body: originalArticle?.body ?? '',
    tags:
      originalArticle?.tagList.map((tag, index) => ({
        id: index + 1,
        value: tag,
      })) ?? [],
  });

  const [newTag, setNewTag] = useState<string>('');

  useEffect(() => {
    if (!user) {
      navigate('/sign-in');
    }
  }, [user, navigate]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    SetEditableArticle((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (id: number, newValue: string) => {
    const updatedTags = editableArticle.tags.map((tag) =>
      tag.id === id ? { ...tag, value: newValue } : tag,
    );
    SetEditableArticle((prev) => ({ ...prev, tags: updatedTags }));
  };

  const handleTagDelete = (idToDelete: number) => {
    SetEditableArticle((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag.id !== idToDelete),
    }));
  };

  const addTag = () => {
    if (newTag.trim() !== '') {
      const newId = Date.now();
      const newTagObject: Tag = { id: newId, value: newTag };
      SetEditableArticle((prev) => ({
        ...prev,
        tags: [...prev.tags, newTagObject],
      }));
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

  const onSubmit = (data: FormValues) => {
    if (!slug) return;

    const articleData = {
      title: data.title,
      description: data.shortDescription,
      body: data.text,
      tagList: editableArticle.tags.map((tag) => tag.value),
    };

    dispatch(updateArticle(slug, articleData, token)).then(() => {
      navigate(`/articles/${slug}`);
    });
  };

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
        defaultValue={editableArticle.title}
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
        defaultValue={editableArticle.description}
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
            defaultValue={editableArticle.body}
            onChange={handleInputChange}
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
          {editableArticle.tags.map((tag) => (
            <div className={styles.tag} key={tag.id}>
              <input
                className={`${styles.formGroupInput} ${styles.tagInput}`}
                id="tags"
                defaultValue={tag.value}
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
    </form>
  );
};

export default EditArticle;
