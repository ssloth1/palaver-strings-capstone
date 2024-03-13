import React from 'react';
import styles from './styles/PasswordResetRequestButton.module.css';

function PasswordResetRequestButton ({onClick, children}) {
    return (
        <button className={styles.passwordResetButton} onClick={onClick}>
            {children|| 'Forgot Password?'}
        </button>
    );
}

export default PasswordResetRequestButton;