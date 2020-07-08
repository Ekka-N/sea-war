import React, { useEffect, useState } from 'react';
import Table from '../Table/Table';
import ResultWindow from '../ResultWindow/ResultWindow';

const Game = ({ boardSize }) => {

  const shipsData = [
    { shipLength: 4, amount: 1 },
    { shipLength: 3, amount: 2 },
    { shipLength: 2, amount: 3 },
    { shipLength: 1, amount: 4 },
  ]

  const [hitView, setHitView] = useState([]);
  const [missView, setMissView] = useState([]);
  const [sunkView, setSunkView] = useState([]);
  const [message, setMessage] = useState('Нажми на клетку, чтобы сделать выстрел');
  let [shipsSunk, setShipsSunk] = useState(0);
  const [endGame, setEndGame] = useState(false);

  const findStopPoints = (shipLocation, direction) => {
    let newStopPoints = [...shipLocation];
  
    shipLocation.forEach( (point, i) => {
      let numToChange = direction === 1 ? point[0] : point[1];
      
      if (numToChange > 0) {
        const arr = point.split('');
        direction === 1 ? --arr[0] : --arr[1];
        newStopPoints.push(arr.join(''));
      }
      
      if (numToChange < boardSize-1) {      
        const arr = point.split('');
        direction === 1 ? ++arr[0] : ++arr[1];
        newStopPoints.push(arr.join(''));
      }
      
      // работа с первой клеткой корабля
      if (i === 0) {
        if (direction === 1) { 
          const arr = point.split('');
          if (point[1] > 0) {
            arr[1] = point[1] - 1;
            newStopPoints.push(arr.join(''));
            if (point[0] > 0) {
              arr[0] = point[0] - 1;
              newStopPoints.push(arr.join(''));  
            }              
            if (point[0] < boardSize-1) {
              arr[0] = +point[0] + 1;
              newStopPoints.push(arr.join(''));
            }      
          }      
          
        } else {
          const arr = point.split('');
          if (point[0] > 0) {
            --arr[0];
            newStopPoints.push(arr.join(''));
             if (point[1] < boardSize-1) {
              ++arr[1];        
              newStopPoints.push(arr.join(''));           
            } 
            if (point[1] > 0) {
              arr[1] = point[1] - 1; 
              newStopPoints.push(arr.join(''));
             }
           }
        }
      };

      // работа с последней клеткой корабля
      if (i === shipLocation.length - 1) {
        if (direction === 1) { 
          const arr = point.split('');
          if (point[1] < boardSize-1) {
            arr[1] = +point[1] + 1;
            newStopPoints.push(arr.join(''));
            if (point[0] < boardSize-1) {
              arr[0] = +point[0] + 1;
              newStopPoints.push(arr.join(''));  
            }              
            if (point[0] > 0) {
              arr[0] = point[0] - 1;
              newStopPoints.push(arr.join(''));
            }      
          } 
          
        } else {
          const arr = point.split('');
          if (arr[0] < boardSize-1) {
            ++arr[0];
            newStopPoints.push(arr.join(''));
            
             if (point[1] < boardSize-1) {
              ++arr[1];        
              newStopPoints.push(arr.join(''));   
            } 
            if (point[1] > 0) {
              arr[1] = point[1] - 1; 
              newStopPoints.push(arr.join(''));
             }
           }
        }
      }; 
    });
    
    return newStopPoints;
  };
     
  // проверка пересечений кораблей
  const collision = (shipsArr, location) => {
    for (let i = 0; i < shipsArr.length; i++) {
      const stopArr = findStopPoints(shipsArr[i].locations, shipsArr[i].direction);
      for (let j = 0; j < location.length; j++) {
          if (stopArr.indexOf(location[j]) >= 0) {
              return true;
          }
        }
      }
    return false;
 };

  const generateShipLocations = (shipLength, direction) => {
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
    
    shipsData.forEach(shipData => {
      for (let i = 0; i < shipData.amount; ++i) {
        const direction = Math.floor(Math.random() * 2);  // 1 - горизонтальный корабль, 0 - вертикальный
        const newLocations = generateShipLocations(shipData.shipLength, direction);
        if (!collision(newShips, newLocations)) {
          const newShip = { 
            locations: newLocations,
            isSunk: false,
            direction: direction
          };
          newShips.push(newShip);
        } else i--;
      };
    });

    return newShips;
  };  
  
  const [ships, setShips] = useState(generateShips());

  const isHit = id => {
    const result = ships.some(ship => {
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
