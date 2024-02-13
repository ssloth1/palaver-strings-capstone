import React from 'react';
import styles from './styles/Button.module.css';

function LoginButton ({onClick, children}) {
    return (
        <button className={styles.loginButton} onClick={onClick}>
            {children|| 'Login'}
        </button>
    );
}

export default LoginButton;