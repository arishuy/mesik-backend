import { Artist, RefreshToken, Request, User } from "../models/index.js";

const createRequest = async ({ name, description }) => {
  const request = await Request.create({
    name: name,
    description: description,
  });

  return request;
};

const fetchRequestById = async (request_id) => {
  const request = await Request.findById(request_id);
  return request;
};

const fetchRequests = async (page = 1, limit = 10) => {
  const pagination = await Request.paginate(
    {},
    {
      sort: { createdAt: -1 },
      page,
      limit,
      lean: true,
      customLabels: {
        docs: "requests",
      },
      populate: {
        path: "user",
        select: "first_name last_name photo_url",
      },
    }
  );
  return pagination;
};

const deleteRequestById = async (request_id) => {
  await Request.deleteOne({ _id: request_id });
};

const updateRequestById = async (request_id, { name, description }) => {
  const request = await Request.findByIdAndUpdate(
    request_id,
    { name, description },
    { new: true }
  );
  return request;
};

const rejectRequestById = async (request_id, reason) => {
  const request = await Request.findByIdAndUpdate(
    request_id,
    { status: "REJECTED", reason: reason },
    { new: true }
  );
  return request;
};

const approveRequestById = async (request_id) => {
  const request = await Request.findByIdAndUpdate(
    request_id,
    { status: "APPROVED" },
    { new: true }
  );

  await Artist.create({
    user: request.user,
    descriptions: request.descriptions,
    display_name: request.display_name,
    albums: [],
    songs: [],
  });

  await User.updateOne({ _id: request.user }, { role: "ARTIST" });
  // remove the refresh token
  await RefreshToken.deleteMany({ user_id: request.user });
  return request;
};

export default {
  createRequest,
  fetchRequests,
  fetchRequestById,
  deleteRequestById,
  updateRequestById,
  approveRequestById,
  rejectRequestById,
};
