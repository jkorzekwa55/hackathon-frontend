import React, {ChangeEvent, useContext, useRef, useState} from 'react';
import styles from "./styles.module.scss";
import arrIcon from "../SignInEmail/right.png";
import {Navigate, useNavigate} from "react-router";
import {AuthenticationContext} from "../../../../AuthenticationContext";
import * as yup from "yup";
import {useMutation} from "react-query";
import {SignInAttemptModel} from "../../model/SignInAttemptModel";
import {httpClient} from "../../../../shared/infra/httpClient";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {SignInModel} from "../../model/SignInModel";
import {SignInResponseModel} from "../../model/SignInResponseModel";
import cookiesHandler from "../../../../shared/infra/cookiesHandler";
import {Config} from "../../../../shared/utils/Config";

function SignInEmailCode() {
    const {authenticated} = useContext(AuthenticationContext);

    const [errorMessage, setErrorMessage] = useState<string>("");

    const navigate = useNavigate();

    const schema = yup.object().shape({
        email: yup.string().email().max(32).required(),
    });

    const { mutate } = useMutation({
        mutationFn: async (values: SignInModel) => {
            console.log(values);

            return await httpClient.post<SignInResponseModel>({
                url: "/b3auth/authenticate",
                data: values
            });
        },
        onSuccess: (res) => {
            sessionStorage.removeItem("email");
            if(res.status == 200) {
                cookiesHandler.save(Config.token, res.data.access_token);
                cookiesHandler.save(Config.refreshToken, res.data.refresh_token);
                cookiesHandler.save(Config.initialized, res.data.initialized.toString());

                if(res.data.initialized) {
                    navigate("/");
                } else {
                    navigate("/sign-in/data");

                }
            } else {
                setErrorMessage("Bad response. Try again.");
            }
        },
        onError: (error: any) => {
            if(error.response) {
                if(error.response.status === 401) {
                    setErrorMessage("Wrong credentials");
                } else if (error.response.status >= 500) {
                    setErrorMessage("Server side error, try again.");
                } else {
                    setErrorMessage("Unknown error.");
                }
            } else {
                setErrorMessage("Network connection error");
            }
        }
    });

    const {
        handleSubmit,
        register,
        formState: {errors}
    } = useForm<SignInAttemptModel>({
        resolver: yupResolver(schema)
    });

    const [code, setCode] = useState<string[]>(Array(6).fill(""));
    const inputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ];

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
                const email = sessionStorage.getItem("email");
                if(email != null) {
                    mutate({email: email, code: newCode.join("")});
                } else {
                    navigate("/sign-in")
                }
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

    if(authenticated) {
        return <Navigate to="/"/>;
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
