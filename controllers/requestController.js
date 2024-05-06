import requestService from "../services/requestService.js";

const createRequest = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const request = await requestService.createRequest({
      name,
      description,
    });
    res.json({ request });
  } catch (error) {
    next(error);
  }
};

const getRequestById = async (req, res, next) => {
  try {
    const { request_id } = req.params;
    const request = await requestService.fetchRequestById(request_id);

    res.json({ request });
  } catch (error) {
    next(error);
  }
};

const getRequests = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const pagination = await requestService.fetchRequests(page, limit);

    res.json({ pagination });
  } catch (error) {
    next(error);
  }
};

const deleteRequest = async (req, res, next) => {
  try {
    const { request_id } = req.params;
    await requestService.deleteRequestById(request_id);

    res.json({ message: "Deleted" });
  } catch (error) {
    next(error);
  }
};

const updateRequestById = async (req, res, next) => {
  try {
    const { request_id } = req.params;
    const { name, description } = req.body;
    const request = await requestService.updateRequestById(request_id, {
      name,
      description,
    });

    res.json({ request });
  } catch (error) {
    next(error);
  }
};

const rejectRequestById = async (req, res, next) => {
  try {
    const { request_id } = req.params;
    const { reason } = req.body;
    const request = await requestService.rejectRequestById(request_id, reason);

    res.json({ request });
  } catch (error) {
    next(error);
  }
};

const approveRequestById = async (req, res, next) => {
  try {
    const { request_id } = req.params;
    const request = await requestService.approveRequestById(request_id);

    res.json({ request });
  } catch (error) {
    next(error);
  }
};

export default {
  createRequest,
  getRequests,
  getRequestById,
  deleteRequest,
  updateRequestById,
  approveRequestById,
  rejectRequestById,
};
