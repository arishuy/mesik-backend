export default {
    get: {
        tags: ["statistics"],
        operationId: "getImcomeForAdmin",
        security: [
            {
                bearerAuth: [],
            },
        ],
        parameters: [{
            name: "start_date",
            in: "query",
            schema: {
                type: "string",
            },
            require: false,
        },
        {
            name: "end_date",
            in: "query",
            schema: {
                type: "string",
            },
            require: false,
        },
        {
            name: "by",
            in: "query",
            schema: {
                type: "string",
            },
            require: false,
            description: '["DAY", "MONTH", "YEAR"]'
        },],
        responses: {},
    },
};
