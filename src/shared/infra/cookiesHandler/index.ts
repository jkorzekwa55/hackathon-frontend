import { CookiesHandlerImpl } from "./CookiesHandlerImpl";

const providers = {
    cookiesHandler: new CookiesHandlerImpl(),
};

export default providers.cookiesHandler;
