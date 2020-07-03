import React, { useState } from 'react';
import styles from './App.module.css';
import Game from './Game/Game';
import Button from './Button/Button';

const App = () => {

  const [startWindow, setStartWindow] = useState(true);
  const boardSize = 10;

  return (
    <main className={styles.wrap}>
      {startWindow ? 
        <div 
          className={styles.startWindow}
          onKeyDown={e => e.keyCode === 13 ? setStartWindow(false) : null}
        >
          <h1 className={styles.title}>Морской бой</h1>
          <div className={styles.infoWrap}>
            <p className={styles.text}>Добро пожаловать в игру!</p>
            <p className={styles.text}>Твоя задача - потопить все корабли.</p>
            <p>
              <span className={styles.subtitle}>Размер доски: </span>
              {`${boardSize}x${boardSize}`}
            </p>            
            <p className={styles.subtitle}>Количество кораблей: </p>
            <p className={styles.text}>1 корабль — четырёхпалубный </p>
            <p className={styles.text}>2 корабля — трёхпалубные</p>
            <p className={styles.text}>3 корабля — двухпалубные</p>
            <p className={styles.text}>4 корабля — однопалубные</p>
          </div>
          <Button 
            text={'Начать игру'}
            onClick={() => setStartWindow(false)}
          />
        </div>
      :
        <Game 
          boardSize={boardSize}
        />
      }
    </main>
  );
}

export default App;
