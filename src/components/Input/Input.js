import React from 'react';
import styles from './Input.module.css';
import classnames from 'classnames';

const Input = ({ value, placeholder, onChangeInput, error, label }) => (    
    <input 
        type="text"
        value={value}
        placeholder={placeholder}
        className={classnames({
            [styles.input]: true,
            [styles.error]: error
        }
        )}
        onChange={onChangeInput}
    />
);

export default Input;
