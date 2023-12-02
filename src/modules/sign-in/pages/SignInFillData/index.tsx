import React from 'react';
import styles from "./styles.module.scss";
import arrIcon from "../SignInEmail/right.png";
import fname from "../SignInFillData/reshot-icon-person-male-QRXH8FCJNZ.svg";
import bdate from "../SignInFillData/reshot-icon-calendar-boxed-UAD9PSZXNL.svg";
import smedia from "../SignInFillData/reshot-icon-earth-S4KULC528N.svg";
import {useNavigate} from "react-router";


function SignInFillData() {
    const navigate = useNavigate();
    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={ () => navigate("/sign-in/")}>
                <h2 className={styles.tytul}>Fill your data</h2>
                <div className={styles.inputContainer}>
                    <div className={styles.div_z_ikona}>
                        <img src={fname} className={styles.img} alt={"person image"}/>
                        <input type={"text"} placeholder={"First name"} className={styles.input}/>
                    </div>
                    <div className={styles.div_z_ikona}>
                        <img src={bdate} className={styles.img} alt={"calendar image"}/>
                        <input type={"text"} placeholder={"Year of birth"} className={styles.input}/>
                    </div>
                    <div className={styles.div_z_ikona}>
                        <img src={smedia} className={styles.img} alt={"planet image"}/>
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
