import React from 'react';
import styles from "./styles.module.scss";
import arrIcon from "../SignInEmail/right.png";

function SignInFillData() {
    return (
        <div className={styles.container}>
            <form className={styles.form}>
                <h2 className={styles.tytul}>Fill your data</h2>
                <div className={styles.inputContainer}>
                    <div className={styles.div_z_ikona}>
                        <input type={"text"} placeholder={"First name"} className={styles.input}/>
                    </div>
                    <div className={styles.div_z_ikona}>
                        <input type={"text"} placeholder={"Year of birth"} className={styles.input}/>
                    </div>
                    <div className={styles.div_z_ikona}>
                        <input type={"text"} placeholder={"Social media link"} className={styles.input}/>
                    </div>
                </div>
                <div className={styles.submitContainer}>
                    <input type="submit" value="CONTINUE" className={styles.submit} />
                    <img src={arrIcon} className={styles.img2} alt="Arr Icon" />
                </div>
            </form>
        </div>
    );
}

export default SignInFillData;
