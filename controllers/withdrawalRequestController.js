import withdrawalService from "../services/withdrawalService.js";
import pusherService from "../services/pusherService.js";

const createWithdrawalRequest = async (req, res, next) => {
    try {
        const user_id = req.authData.user._id;
        const { amount, bank_account } = req.body;
        const request = await withdrawalService.createWithdrawalRequest({ user_id, amount, bank_account });
        res.json({ request })
    } catch (error) {
        next(error);
    }
}

const getWithdrawalRequests = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const pagination = await withdrawalService.fetchWithdrawalRequests({ page, limit });

        res.json({ pagination });

    } catch (error) {
        next(error);
    }
}

const getWithdrawalRequestById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const withdrawal_request = await withdrawalService.fetchWithdrawalRequestById(id);

        res.json({ withdrawal_request });

    } catch (error) {
        next(error);
    }
}

const fulfillWithdrawalRequest = async (req, res, next) => {
    try {
        const { id } = req.params;
        const withdrawal_request = await withdrawalService.fulfillWithdrawalRequest(id);

        pusherService.updateBalance(withdrawal_request.user._id, withdrawal_request.user.balance);

        res.json({ withdrawal_request });

    } catch (error) {
        next(error);
    }
}

const cancelWithdrawalRequest = async (req, res, next) => {
    try {
        const { id } = req.params;
        const withdrawal_request = await withdrawalService.cancelWithdrawalRequest(id);

        res.json({ withdrawal_request });

    } catch (error) {
        next(error);
    }
}

export default {
    createWithdrawalRequest,
    getWithdrawalRequests,
    getWithdrawalRequestById,
    fulfillWithdrawalRequest,
    cancelWithdrawalRequest
}