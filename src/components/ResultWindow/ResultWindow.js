import React from 'react';
import styles from './ResultWindow.module.css';
import Button from '../Button/Button';

const ResultWindow = ({ shots, ships }) => (
  <div className={styles.wrap}>
      <h2 className={styles.title}>Конец игры.<br />Результат:</h2>      
      <p className={styles.text}>
        Потоплено кораблей: {ships}<br />
        Выстрелов сделано: {shots}
      </p>
      <Button 
        text={'Сыграть снова'}
        onClick={() => document.location.reload()}
      />
  </div>
);

export default ResultWindow;
