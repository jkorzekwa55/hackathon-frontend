// SignInEmail.jsx

import React, {useContext, useState} from 'react';
import styles from "./styles.module.scss";
import mailIcon from '../../../../assets/mail.svg';
import arrowRight from '../../../../assets/arrow_right.svg';
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {Navigate, useNavigate} from "react-router";
import {useForm} from "react-hook-form";
import {AuthenticationContext} from "../../../../AuthenticationContext";
import {useMutation} from "react-query";
import {SignInAttemptModel} from "../../model/SignInAttemptModel";
import {SignInResponseModel} from "../../model/SignInResponseModel";
import {Config} from "../../../../shared/utils/Config";
import {httpClient} from "../../../../shared/infra/httpClient";
import cookiesHandler from "../../../../shared/infra/cookiesHandler";

function SignInEmail() {
    const {authenticated} = useContext(AuthenticationContext);

    const [errorMessage, setErrorMessage] = useState<string>("");

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const schema = yup.object().shape({
        email: yup.string().email().max(32).required(),
    });

    const { mutate } = useMutation({
        mutationFn: async (values: SignInAttemptModel) => {
            console.log(values);

            sessionStorage.setItem("email", values.email);

            return await httpClient.post({
                url: "/b3auth/attempt",
                data: values
            });
        },
        onSuccess: (res) => {

            if(res.status == 200) {
                navigate("/sign-in/code");
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

    if(authenticated) {
        return <Navigate to="/"/>;
    }

    return (
        <div className={styles.container}>

            <form name="sign-up" className={styles.form} onSubmit={handleSubmit((values) => mutate(values))}>
                <h1 className={styles.tytul}>WeFolk</h1>
                <h3>Sign in</h3>
                {errorMessage !== "" && <label className={styles.error}>{errorMessage}</label>}
                {errors.email && <label className={styles.error}>{errors.email.message}</label>}
                <div className={styles.div_icon}>
                    <img src={mailIcon} className={styles.img} alt="Mail Icon" />
                    <input type="email"
                           placeholder="Type your email"
                           className={`${styles.input}  ${errors.email ? styles.invalid : ""}`}
                           {...register("email")}/>
                </div>
                <div className={styles.submitContainer}>
                    <input type="submit" value="SIGN IN" className={styles.submit} />
                    <div className={styles.arrow_holder}>
                        <img src={arrowRight} className={styles.img2} alt="Arr Icon" />
                    </div>
                </div>
            </form>
            <p>Enjoy our app!</p>
        </div>
    );
}

export default SignInEmail;
