import {UserModel} from "./UserModel";
import {EventModel} from "./EventModel";

export type EventResponseModel = {
    id: number;
    message: string;
    sender: UserModel;
    event: EventModel;
}