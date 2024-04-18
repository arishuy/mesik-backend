import basicInfo from "./basicInfo.js";
import servers from "./servers.js";
import tags from "./tags.js";
import components from "./components.js";
import auth from "./auth/index.js";
import user from "./user/index.js";
import expert from "./expert/index.js";
import major from "./major/index.js";
import certificate from "./certificate/index.js";
import jobRequest from "./jobRequest/index.js";
import review from "./review/index.js";
import transaction from "./transaction/index.js";
import report from "./report/index.js";
import statistics from "./statistics/index.js";
import withdrawalRequest from "./withdrawalRequest/index.js";

export default {
  ...basicInfo,
  ...servers,
  ...tags,
  ...components,
  paths: {
    ...auth,
    ...user,
    ...expert,
    ...major,
    ...certificate,
    ...jobRequest,
    ...review,
    ...transaction,
    ...report,
    ...statistics,
    ...withdrawalRequest
  },
};
