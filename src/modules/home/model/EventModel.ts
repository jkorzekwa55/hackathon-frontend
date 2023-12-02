import {UserModel} from "./UserModel";

export type EventModel = {
    id: number;
    name: string;
    creator: UserModel;
    longitude: number;
    latitude: number;
    plannedOn: string;
    image: Blob;
    inProgress: boolean;
    happened: boolean ;
}