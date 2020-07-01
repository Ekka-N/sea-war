import React, { useState } from 'react';
import styles from './App.module.css';
import Game from './Game/Game';
import Button from './Button/Button';
import Input from './Input/Input';

const App = () => {

  const [startWindow, setStartWindow] = useState(true);
  const [boardSize, setBoardSize] = useState('');
  const [shipAmount, setShipAmount] = useState('');
  const [error, setError] = useState('');

  const shipLength = 3;

  const startTheGame = () => {

    switch(true) {
      case (!boardSize || !shipAmount):
        setError('Заполнены не все поля!');
        break;
      case ((+boardSize ^ 0) !== +boardSize):
        setError('Размер доски должен быть целым числом!');
        break;
      case ((+boardSize ^ 0) !== +shipAmount):
        setError('Количество кораблей должно быть целым числом!');
        break;
      case (+boardSize < +shipLength):
        setError('Размер доски не может быть меньше корабля!');
        break;
      case (+shipAmount > +boardSize):
          setError('Многовато кораблей!');
          break;
      default:
        setStartWindow(false);
    }

  } 

  return (
    <main className={styles.wrap}>
      {startWindow ? 
        <div 
          className={styles.startWindow}
          onKeyDown={e => e.keyCode === 13 ? startTheGame() : null}
        >
          <h1 className={styles.title}>Морской бой</h1>
          <div className={styles.inputsWrap}>
            <p>Размер корабля - 3 клетки</p>
            <p>Размер доски: </p>
            <Input
              value={boardSize}
              placeholder={'Размер доски'}
              error={error}
              onChangeInput={e => {setError(''); setBoardSize(e.target.value)}}
            />
            <p>Количество кораблей: </p>
            <Input
              value={shipAmount}
              placeholder={'кораблей'}
              error={error}
              onChangeInput={e => {setError(''); setShipAmount(e.target.value)}}
            />
          </div>
          <Button 
            text={'Начать игру'}
            onClick={startTheGame}
          />

          {error && 
            <div className={styles.errorMessage}>
              {error}
            </div>
          }
        </div>
      :
        <Game 
          boardSize={boardSize}
          shipLength={shipLength}
          shipAmount={shipAmount}
        />
      }
    </main>
  );
}

export default App;
