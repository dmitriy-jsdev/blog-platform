import {
  useState,
  useEffect,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react';
import { useForm, type FieldErrors } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { postArticle } from '../../app/store/actions/postArticle';
import Input from '../../shared/ui/Input/Input';
import type { AppDispatch } from '../../app/store/store';
import styles from './CreateArticle.module.css';

type Tag = { id: number; value: string };

type ArticleState = {
  title: string;
  shortDescription: string;
  text: string;
  tags: Tag[];
};

type FormValues = {
  title: string;
  shortDescription: string;
  text: string;
};

type RootStatePart = {
  user: { user: { token?: string } | null };
};

const CreateArticle = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const user = useSelector((state: RootStatePart) => state.user.user);
  const token = useSelector((state: RootStatePart) => state.user.user?.token);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const [article, setArticle] = useState<ArticleState>({
    title: '',
    shortDescription: '',
    text: '',
    tags: [],
  });
  const [newTag, setNewTag] = useState<string>('');

  useEffect(() => {
    if (!user) navigate('/sign-in');
  }, [user, navigate]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setArticle((prev) => ({ ...prev, [name]: value }) as ArticleState);
  };

  const handleTagChange = (id: number, newValue: string) => {
    const updated = article.tags.map((tag) =>
      tag.id === id ? { ...tag, value: newValue } : tag,
    );
    setArticle((prev) => ({ ...prev, tags: updated }));
  };

  const handleTagDelete = (idToDelete: number) => {
    const filtered = article.tags.filter((tag) => tag.id !== idToDelete);
    setArticle((prev) => ({ ...prev, tags: filtered }));
  };

  const handleTagBlur = (id: number, value: string) => {
    if (!value.trim()) handleTagDelete(id);
  };

  const addTag = () => {
    if (!newTag.trim()) return;
    const newTagObject: Tag = { id: Date.now(), value: newTag };
    setArticle((prev) => ({ ...prev, tags: [...prev.tags, newTagObject] }));
    setNewTag('');
  };

  const handleTagAddKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const onSubmit = (data: FormValues) => {
    const articleData = {
      title: data.title,
      description: data.shortDescription,
      body: data.text,
      tagList: article.tags.map((tag) => tag.value),
    };

    dispatch(postArticle(articleData, token)).then(() => navigate('/'));
  };

  return (
    <form
      className={styles.articleForm}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className={styles.header}>Create new article</div>

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
            value={article.text}
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
          {article.tags.map((tag) => (
            <div className={styles.tag} key={tag.id}>
              <input
                className={`${styles.formGroupInput} ${styles.tagInput}`}
                id="tags"
                value={tag.value}
                onChange={(e) => handleTagChange(tag.id, e.target.value)}
                onBlur={() => handleTagBlur(tag.id, tag.value)}
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
            className={`${styles.formGroupInput} ${styles.tagInput}`}
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

export default CreateArticle;
