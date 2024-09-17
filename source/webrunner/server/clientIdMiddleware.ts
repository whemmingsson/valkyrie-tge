import { setClientId } from "../../engine/src/state/game-context.js";

const clientIdMiddleware = (req, res, next) => {
    const clientId = req.headers['clientid'];
    if (!clientId) {
        res.status(400).send('ClientId header is missing');
        return;
    }

    setClientId(clientId);
    next();
};

export default clientIdMiddleware;