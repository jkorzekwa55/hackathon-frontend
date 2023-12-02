import React, {Dispatch, SetStateAction, useContext, useState} from 'react';
import styles from "./styles.module.scss";
import arrIcon from "../SignInEmail/right.png";
import save from "../../../../assets/save.svg";
import question_mark from "../../../../assets/question-mark.svg";
import calendar from "../../../../assets/calendar.svg";
import user from "../../../../assets/user.svg";

import {Navigate, useNavigate} from "react-router";
import arrowRight from "../../../../assets/arrow_right.svg";
import {AuthenticationContext} from "../../../../AuthenticationContext";
import * as yup from "yup";
import {useMutation} from "react-query";
import {SignInAttemptModel} from "../../model/SignInAttemptModel";
import {httpClient} from "../../../../shared/infra/httpClient";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {FillDataRequestModel} from "../../model/FillDataRequestModel";
import {FillDataResponseModel} from "../../model/FIllDataResponseModel";
import cookiesHandler from "../../../../shared/infra/cookiesHandler";
import {Config} from "../../../../shared/utils/Config";

export type SignInFillDataProps = {
    setAuthenticated: Dispatch<SetStateAction<boolean>>;
    [key: string]: unknown;
}


function SignInFillData({setAuthenticated}: SignInFillDataProps) {

    const {authenticated} = useContext(AuthenticationContext);

    const [errorMessage, setErrorMessage] = useState<string>("");

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const schema = yup.object().shape({
        name: yup.string().max(32).required(),
        birthYear: yup.number().max(4).required(),
        socialMediaLink: yup.string().max(512).required(),
    });

    const { mutate } = useMutation({
        mutationFn: async (values: FillDataRequestModel) => {

            console.log("mutate")

            return await httpClient.post<FillDataResponseModel>({
                url: "/user/data-fill",
                data: values
            });
        },
        onSuccess: (res) => {

            if(res.status == 200) {
                if(res.data.initialised) {
                    cookiesHandler.save(Config.initialized, res.data.initialised.toString())
                }

                setAuthenticated(true);

                navigate("/");

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
    } = useForm<FillDataRequestModel>({
        resolver: yupResolver(schema)
    });

    if(authenticated) {
        return <Navigate to="/"/>;
    }

    return (
        <div className={styles.container}>
            <form className={styles.form}>
                <h2 className={styles.tytul}>Fill your data</h2>
                <div className={styles.inputContainer}>
                    <div className={styles.div_icon}>
                        <img src={user} className={styles.img} alt={"person image"}/>
                        <input type={"text"}
                               placeholder={"First name"}
                               className={`${styles.input}  ${errors.name ? styles.invalid : ""}`}
                               {...register("name")}/>
                    </div>
                    <div className={styles.div_icon}>
                        <img src={calendar}
                             className={styles.img} alt={"calendar image"}/>
                        <input type={"text"} placeholder={"Year of birth"}
                               className={`${styles.input}  ${errors.birthYear ? styles.invalid : ""}`}
                               {...register("birthYear")}/>
                    </div>
                    <div className={styles.div_icon}>
                        <img src={save}
                             className={styles.img} alt={"planet image"}/>
                        <input type={"text"}
                               placeholder={"Social media link"}
                               className={`${styles.input}  ${errors.socialMediaLink ? styles.invalid : ""}`}
                               {...register("socialMediaLink")}/>
                    </div>
                </div>
                <div className={styles.submitContainer}>
                    <input type="submit" value="CONTINUE" className={styles.submit} onSubmit={handleSubmit((values) => mutate(values))}/>
                    <div className={styles.arrow_holder}>
                        <img src={arrowRight} className={styles.img2} alt="Arr Icon" />
                    </div>
                </div>
            </form>
        </div>
    );
}

export default SignInFillData;
