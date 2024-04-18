import { Report } from "../models/index.js";
import cloudinaryService from "./cloudinaryService.js";

const createReport = async ({ user_id, title, description, photo }) => {
  let response;
  if (photo) {
    response = await cloudinaryService.upload(photo);
  }
  const report = await Report.create({
    title,
    user: user_id,
    description,
    photo_url: response ? response.url : null,
    photo_public_id: response ? response.public_id : null,
  });

  return report;
};

const fetchReportById = async (report_id) => {
  const report = await Report.findById(report_id).populate([
    {
      path: "user",
      select:
        "first_name last_name gender phone address photo_url DoB email username role isRestricted isConfirmed",
    },
  ]);
  return report;
};

const fetchReports = async (page = 1, limit = 10) => {
  const pagination = await Report.paginate(
    {},
    {
      sort: { createdAt: -1 },
      populate: [
        {
          path: "user",
          select: "first_name last_name photo_url",
        },
      ],
      page,
      limit,
      lean: true,
      customLabels: {
        docs: "reports",
      },
    }
  );
  return pagination;
};

const deleteReportById = async (report_id) => {
  const report = await Report.findById(report_id);

  if (report.photo_public_id) {
    cloudinaryService.deleteByPublicId(report.photo_public_id);
  }
  await Report.deleteOne({ _id: report_id });
};

export default {
  createReport,
  fetchReports,
  fetchReportById,
  deleteReportById,
};
