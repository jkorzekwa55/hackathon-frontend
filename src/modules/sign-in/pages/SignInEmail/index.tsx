// SignInEmail.jsx

import React from 'react';
import styles from "./styles.module.scss";
import mailIcon from './mail.png';
import arrIcon from './right.png';

function SignInEmail() {
    return (
        <div className={styles.container}>

            <form className={styles.form}>
                <h1 className={styles.tytul}>WeFolk</h1>
                <h2>Sign in</h2>
                <div className={styles.div_z_ikona}>
                    <img src={mailIcon} className={styles.img} alt="Mail Icon" />
                    <input type="email" placeholder="abc@email.com" className={styles.input} />
                </div>
                <div className={styles.submitContainer}>
                    <input type="submit" value="SIGN IN" className={styles.submit} />
                    <img src={arrIcon} className={styles.img2} alt="Arr Icon" />
                </div>
            </form>
        </div>
    );
}

export default SignInEmail;
