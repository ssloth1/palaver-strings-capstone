import React from 'react';
import styles from './styles/LoginButton.module.css';

function LoginButton ({onClick, children}) {
    return (
        <button className={styles.loginButton} onClick={onClick}>
            {children|| 'login'}
        </button>
    );
}

export default LoginButton;