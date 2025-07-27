import React from 'react';
import styles from './Loader.module.css';

const Loader: React.FC = () => (
  <p className={styles.text}>Loading movies, please wait...</p>
);

export default Loader;
