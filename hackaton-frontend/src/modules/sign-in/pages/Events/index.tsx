import React from 'react';
import styles from "./styles.module.scss";

function Events(){
    return(
        <div className={styles.container}>
            <div className={styles.innerContainer}>
                <h1 className={styles.tytul}>Events</h1>
                <div className={styles.innerContainer2}>

                    <p className={styles.date}>Wed, Apr 28, 5:30 PM</p>
                    <p className={styles.location}>Radius Gallery, Santa Cruz, CA</p>
                    <p className={styles.fname}>Marcin</p>
                    <p className={styles.message}>costam</p>

                </div><br/>
                <div className={styles.innerContainer2}>
                    <p className={styles.date}>Wed, Apr 28, 5:30 PM</p>
                    <p className={styles.fname}>Marcin</p>
                    <p className={styles.message}>costam</p>
                    <p className={styles.location}>Radius Gallery, Santa Cruz, CA</p>
                </div>



            </div>


        </div>
    );
}
export default Events;