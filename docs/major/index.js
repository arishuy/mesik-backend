import createMajor from "./createMajor.js";
import getAllMajors from "./getAllMajors.js";
import updateMajor from "./updateMajor.js";
import deleteMajor from "./deleteMajor.js";
import getMajorById from "./getMajorById.js";

export default {
  "/majors": {
    ...createMajor,
    ...getAllMajors,
  },
  "/majors/{major_id}": {
    ...getMajorById,
    ...updateMajor,
    ...deleteMajor,
  },
};
