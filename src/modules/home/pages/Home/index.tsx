import React, {useEffect, useState} from 'react';
import styles from "./styles.module.scss";
import Map from 'react-map-gl';
import users from "../../../../assets/user--multiple.svg";

export type Coords = {
    lat: number;
    lon: number;
}

function Home() {

    const [coords, setCoords] = useState<Coords>();

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(function(position) {
                setCoords({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                })
            });
        }
    }, []);


    return (
        <div className={styles.container}>
            {coords &&
                <Map
                    mapboxAccessToken="pk.eyJ1IjoibWk3Y2hhbCIsImEiOiJjbHBuYmxieXYwNDRqMmpvN3RlcHMxdDlsIn0.E0HeoBVKgKseuTW69dZPcg"
                    initialViewState={{
                        longitude: coords.lon,
                        latitude: coords.lat,
                        zoom: 14
                    }}
                    style={{width: "100%", height: "100%", position: "relative"}}
                    mapStyle="mapbox://styles/mapbox/streets-v9"
                >
                    <div className={styles.menu_overlay}>
                        <img src={users} />
                        <button>Requests</button>
                    </div>
                </Map>
            }
        </div>
    );
}

export default Home;
