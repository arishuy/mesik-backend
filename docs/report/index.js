import createReport from "./createReport.js";
import getReports from "./getReports.js";
import getReportById from "./getReportById.js";
import deleteReport from "./deleteReport.js";

export default {
  "/reports": {
    ...createReport,
    ...getReports,
  },
  "/reports/{report_id}": {
    ...getReportById,
    ...deleteReport,
  },
};
