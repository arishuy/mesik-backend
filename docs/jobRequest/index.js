import createJobRequest from "./createJobRequest.js";
import getJobRequests from "./getJobRequests.js";
import getJobRequestById from "./getJobRequestById.js";
import acceptJobRequest from "./acceptJobRequest.js";
import updateJobRequest from "./updateJobRequest.js";
import cancelJobRequest from "./cancelJobRequest.js";
import completeJobRequest from "./completeJobRequest.js";
import getReview from "./getReview.js";
import deleteJobRequest from "./deleteJobRequest.js";
import completeAndPayment from "./completeAndPayment.js";

export default {
  "/job_requests": {
    ...createJobRequest,
    ...getJobRequests,
  },
  "/job_requests/{job_request_id}": {
    ...getJobRequestById,
    ...updateJobRequest,
    ...deleteJobRequest,
  },
  "/job_requests/{job_request_id}/review": {
    ...getReview,
  },
  "/job_requests/{job_request_id}/accept": {
    ...acceptJobRequest,
  },
  "/job_requests/{job_request_id}/cancel": {
    ...cancelJobRequest,
  },
  "/job_requests/{job_request_id}/complete": {
    ...completeJobRequest,
  },
  "/job_requests/{job_request_id}/complete-and-payment": {
    ...completeAndPayment,
  },
};
