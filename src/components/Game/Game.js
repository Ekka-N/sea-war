import React, { useEffect, useState } from 'react';
import Table from '../Table/Table';
import ResultWindow from '../ResultWindow/ResultWindow';

const Game = ({ boardSize, shipLength, shipAmount }) => {

  const [hitView, setHitView] = useState([]);
  const [missView, setMissView] = useState([]);
  const [sunkView, setSunkView] = useState([]);
  const [message, setMessage] = useState('Нажми на клетку, чтобы сделать выстрел');
  let [shipsSunk, setShipsSunk] = useState(0);
  const [endGame, setEndGame] = useState(false);
  
  // проверка пересечений кораблей
  const collision = (shipsArr, location) => {
    for (let i = 0; i < shipsArr.length; i++) {
     for (let j = 0; j < location.length; j++) {
         if (shipsArr[i].locations.indexOf(location[j]) >= 0) {
             return true;
         }
       }
    }
    return false;
 };

  const generateShipLocations = () => {
    const direction = Math.floor(Math.random() * 2);  // 1 - горизонтальный корабль, 0 - вертикальный
    let row, col;
    
    // генерация начальной позиции корабля
    if (direction === 1) {
      row = Math.floor(Math.random() * boardSize);
      col = Math.floor(Math.random() * (boardSize - shipLength));
    } else {
      row = Math.floor(Math.random() * (boardSize - shipLength));
      col = Math.floor(Math.random() * boardSize);
    }

    const newShip = [];
    for (let i = 0; i < shipLength; ++i) {
      (direction === 1) ? newShip.push(`${row}${col + i}`) 
        : newShip.push(`${row + i}${col}`)
    }

    return newShip;
  };

  const generateShips = () => {
    const newShips = [];

    for (let i = 0; i < shipAmount; ++i) {
      const newLocations = generateShipLocations();
      if (!collision(newShips, newLocations)) {
        const newShip = { locations: newLocations, isSunk: false};
        newShips.push(newShip);
      } else i--;
    };
    
    return newShips;
  };  
  
  const [ships, setShips] = useState(generateShips());

  const isHit = id => {
    const result = ships.some( ship => {
      if (ship.locations.indexOf(id) !== -1) {
        const newArr = [...hitView];
        newArr.push(id);

        setHitView(newArr);
        setMessage('Корабль подбит!');
        return ship;
      }
    });

    return result;
  }

  const onCellClick = e => {
    const id = e.target.id; 
        
    if (hitView.indexOf(id) === -1) {      
      if (!isHit(id)) {
        if (missView.indexOf(id) === -1) {
          const newArr = [...missView];
          newArr.push(id);

          setMissView(newArr);
          setMessage('Мимо!');
        }
      };
    }
  };

  useEffect(() => {
    const newShips = [...ships];

    newShips.forEach( ship => {
      if (!ship.isSunk) {
        const isSunk = ship.locations.every( point => hitView.indexOf(point) !== -1);
        if (isSunk) {
          setShipsSunk(++shipsSunk);
          ship.isSunk = true;
          setSunkView([...sunkView, ...ship.locations]);

          setMessage(`Корбаль затоплен! Потоплен ${shipsSunk}й корабль`);
        }
      }
    });
    setShips(newShips);
    if (ships.every(ship => ship.isSunk)) setEndGame(true);


  }, [hitView]);

  return (
    <>
      {endGame ? 
        <ResultWindow 
          shots={hitView.length + missView.length}
          ships={shipsSunk}
        />
      :
        <Table 
          message={message}
          scale={+boardSize}
          onCellClick={onCellClick}
          shotView={{
            hitView: hitView,
            missView: missView,
            sunkView:sunkView
          }}
        />
      }
    </>
  );
}

export default Game;
