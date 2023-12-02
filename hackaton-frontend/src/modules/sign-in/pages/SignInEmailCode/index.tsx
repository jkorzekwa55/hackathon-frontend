import React from 'react';
import styles from "./styles.module.scss";
import arrIcon from "../SignInEmail/right.png";

function SignInEmailCode() {
    return (
        <div className={styles.container}>
            <form className={styles.form}>
                <h2 className={styles.tytul}>Verification</h2>
                <div className={styles.inputContainer}>
                    <input type={"text"} className={styles.numberInput} placeholder={"-"}/>
                    <input type={"text"} className={styles.numberInput} placeholder={"-"}/>
                    <input type={"text"} className={styles.numberInput} placeholder={"-"}/>
                    <input type={"text"} className={styles.numberInput} placeholder={"-"}/>
                    <input type={"text"} className={styles.numberInput} placeholder={"-"}/>
                    <input type={"text"} className={styles.numberInput} placeholder={"-"}/>
                </div>
                <div className={styles.submitContainer}>
                    <input type="submit" value="CONTINUE" className={styles.submit} />
                    <img src={arrIcon} className={styles.img2} alt="Arr Icon" />
                </div>
            </form>
        </div>
    );
}

export default SignInEmailCode;
