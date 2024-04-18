export default {
    post: {
        tags: ["withdrawal-request"],
        operationId: "createWithdrawalRequest",
        security: [
            {
                bearerAuth: [],
            },
        ],
        parameters: [],
        requestBody: {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            amount: {
                                type: "integer",
                                require: true,
                            },
                            bank_account: {
                                type: "object",
                                properties: {
                                    number: { type: "string", required: true },
                                    owner_name: { type: "string", required: true },
                                    bank_name: { type: "string", required: true },
                                },
                                require: true,
                            },
                        },
                    },
                },
            },
        },
        responses: {},
    },
};
