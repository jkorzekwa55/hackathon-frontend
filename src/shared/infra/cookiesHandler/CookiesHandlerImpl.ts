import { CookiesHandler } from "./CookiesHandler";


export class CookiesHandlerImpl implements CookiesHandler {


    public resetAndClearCookies(): void {
        // get all cookies as an array
        const cookies = document.cookie.split(";");

        // for each cookie set date to some past date (delete it)
        for (const cookie of cookies) {
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    }

    public get(key: string): string | null {
        // match (get if exists)
        const match = document.cookie.match(new RegExp("(^| )" + key + "=([^;]+)"));

        // if found return it or return null if didn't
        if (match) {
            return match[2] || null;
        } else {
            return null;
        }
    }

    public save(key: string, value: string, validDays = 365): void {

        // sets expiration date
        const d = new Date();
        d.setTime(d.getTime() + validDays * 24 * 60 * 60 * 1000);
        const expires = "expires=" + d.toUTCString();

        // saves cookie
        document.cookie = key + "=" + value + ";" + expires + ";path=/";
    }

    public delete(key: string): void {
        document.cookie = key + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}
