import httpStatus from "http-status";
import { Certificate, ExpertInfo, Major } from "../models/index.js";
import cloudinaryService from "./cloudinaryService.js";
import ApiError from "../utils/ApiError.js";
import mongoose from "mongoose";

const createCertificate = async ({
  user_id,
  name,
  major_id,
  descriptions,
  photo,
}) => {
  const expert = await ExpertInfo.findOne({ user: user_id });
  if (!expert) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Expert not found");
  }

  if (!(await Major.exists({ _id: major_id }))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Major not found");
  }

  // upload image
  const response = await cloudinaryService.upload(photo);

  const certificate = new Certificate({
    name,
    major: major_id,
    descriptions,
    photo_url: response.url,
    photo_public_id: response.public_id,
    isVerified: false,
  });
  await certificate.save();

  // add new certificate to current expert's certificates
  expert.certificates.push(certificate);
  await expert.save();

  return certificate;
};

const deleteCertificateById = async (user_id, certificate_id) => {
  const expert = await ExpertInfo.findOne({ user: user_id });
  if (!expert) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Expert not found");
  }
  const certificate = await Certificate.findById(certificate_id);
  if (!certificate) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Certificate not found");
  }
  if (!expert.certificates.includes(certificate._id)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "This certificate doesn't belong to current expert"
    );
  }

  // delete certificate from expert's certificates
  expert.certificates.pull(certificate);
  // delete photo
  cloudinaryService.deleteByPublicId(certificate.photo_public_id);
  // delete certificate from database
  await certificate.deleteOne();
  await expert.save();
  await updateVerifiedMajor(expert._id);
};

const verifyCertificateById = async (certificate_id) => {
  const certificate = await Certificate.findByIdAndUpdate(
    certificate_id,
    {
      isVerified: true,
    },
    { new: true }
  );
  if (!certificate) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Certificate not found");
  }
  const expert = await ExpertInfo.findOne({
    certificates: certificate._id,
  }).lean();

  await updateVerifiedMajor(expert._id).catch((error) => {
    throw error;
  });
  return certificate;
};

const updateVerifiedMajor = async (expert_id) => {
  const expert = await ExpertInfo.findById(expert_id, {
    select: "certificates",
  }).populate({
    path: "certificates",
    populate: {
      path: "major",
    },
    match: { isVerified: true },
  });

  if (!expert) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Expert not found");
  }

  const majors = [
    ...new Set(expert.certificates.map((certificate) => certificate.major._id)),
  ];

  await expert.updateOne({ verified_majors: majors });
};

export default {
  createCertificate,
  deleteCertificateById,
  verifyCertificateById,
  updateVerifiedMajor,
};
