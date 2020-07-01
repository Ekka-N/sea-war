import React from 'react';
import styles from './Table.module.css';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const Table = ({ message, scale, onCellClick, shotView  }) => {
  
  const generateBoard = scale => {
    const arrayRow = [];
    const arrayCell = [];

    for (let i = 0; i<scale; ++i) {
      arrayRow.push(i);
      arrayCell.push(i);
    }
    
    return arrayRow.map(i => (
          <tr key={`${i}row`}>
            {arrayCell.map(num => (
              <td 
                className={classnames({
                  [styles.cell]: true,
                  [styles.hit]: shotView.hitView.indexOf(`${i}${num}`) !== -1,                  
                  [styles.miss]: shotView.missView.indexOf(`${i}${num}`) !== -1,
                  [styles.sunk]: shotView.sunkView.indexOf(`${i}${num}`) !== -1,
                })}
                id={`${i}${num}`}
                key={`${i}${num}`}
                onClick={onCellClick}
              />
            ))}
          </tr>
        )
      );
  };
  
  return (
    <div className={styles.tableWrap}>
    <h2 className={styles.message}>{message}</h2>
    <table className={styles.table}>        
        <tbody>
        {generateBoard(scale)}            
        </tbody>
    </table>
    </div>
  );
};

Table.propTypes = {
    message: PropTypes.string.isRequired,
    scale: PropTypes.number.isRequired,
    onCellClick: PropTypes.func,
    shotView: PropTypes.object
}

export default Table;
