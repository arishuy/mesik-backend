import create from "./create.js";
import getAll from "./getAll.js";
import getById from "./getById.js";
import fulfillRequest from "./fulfillRequest.js";
import cancelRequest from "./cancelRequest.js";

export default {
    "/withdrawal-requests": {
        ...create,
        ...getAll
    },
    "/withdrawal-requests/{id}": {
        ...getById,
    },
    "/withdrawal-requests/{id}/fulfill": {
        ...fulfillRequest,
    },
    "/withdrawal-requests/{id}/cancel": {
        ...cancelRequest,
    }
}