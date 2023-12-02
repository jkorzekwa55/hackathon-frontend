import React, {Dispatch, SetStateAction, useEffect} from 'react';
import styles from "./styles.module.scss";
import EventComponent from "../EventComponent";
import {useFetchEventResponses} from "../../hooks/useFetchEventResponses";

export type EventsModalComponentProps = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    [key: string]: unknown;
}

function EventsModalComponent({open, setOpen}: EventsModalComponentProps){
    const {events} = useFetchEventResponses();

    useEffect(() => {
        console.log("my events", events);
    }, [events]);


    if(!open) {
        return <></>;
    }

    return(
        <div className={styles.container}>
            <div className={styles.innerContainer}>
                <h1 className={styles.tytul}>Events</h1>
                <div className={styles.list}>
                    {events && events.map && events.map((event, i) => <EventComponent key={i} eventResponse={event}/>)}
                </div>

                <button className={styles.close_button} onClick={() => setOpen(false)}>Close</button>
            </div>


        </div>
    );
}
export default EventsModalComponent;