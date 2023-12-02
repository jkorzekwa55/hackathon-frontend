import React, {ChangeEvent, useRef, useState} from 'react';
import styles from "./styles.module.scss";
import arrIcon from "../SignInEmail/right.png";
import {useNavigate} from "react-router";

function SignInEmailCode() {
    const [code, setCode] = useState<string[]>(Array(6).fill(""));
    const inputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ];

    const navigate = useNavigate();
    function digitOnChange(e: React.ChangeEvent<HTMLInputElement>, index: number) {
        const target = e.target as HTMLInputElement;
        const value = target.value.replace(/\D/g, "");

        const newCode: string[] = [...code];

        newCode[index] = value[0];
        if (value.length === 0) {
            // Prevent input from becoming uncontrolled
            newCode[index] = "";
        }
        for (let i = 1; i < value.length; i++) {
            if (i > inputRefs.length) {
                break;
            }
            if (index + i >= inputRefs.length) {
                break;
            }
            newCode[index + i] = value[i];
            const nextInput = target.nextElementSibling as HTMLInputElement | null;
            nextInput?.focus();
        }

        setCode(newCode);
        const fullCodeEntered = newCode.every((value: string) => value != "");
        if (fullCodeEntered) {
            const isValid = true;
            if (isValid) {
                navigate("/sign-in/code");
            }
        }
    }

    function handleKeyDown(e: React.KeyboardEvent, index: number) {
        if (e.key === "Backspace") {
            const target = e.target as HTMLInputElement;
            if (target.value === "" && index - 1 >= 0) {
                e.preventDefault();
                inputRefs[index - 1].current?.focus();
            }
        }
    }

    return (
        <main className={styles.container}>
            <div className={styles.fill_page}>
                <div>
                    <h2 className={styles.tytul}>Verification</h2>
                    <p className={styles.form_explainer}>Please enter code from your email to continue</p>
                    <div className={styles.code_inputs}>
                        {[1, 2, 3, 4, 5, 6].map((digit, index) => (
                            <input
                                autoFocus={digit === 1}
                                key={index}
                                type="text"
                                inputMode="numeric"
                                value={code[index]}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => digitOnChange(e, index)}
                                ref={inputRefs[index]}
                                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, index)}
                                className={styles.numberInput}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}

export default SignInEmailCode;
