import { ReactComponent as SpinnerSvg } from '../../assets/spinner.svg';
import styles from './Spinner.module.css';

const Spinner = (): JSX.Element => (
  <div className={styles.spinner}>
    <SpinnerSvg className={styles.spinnerImg} />
  </div>
);

export default Spinner;
