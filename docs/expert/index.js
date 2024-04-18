import getAllExperts from "./getAllExperts.js";
import getExpertInfoById from "./getExpertInfoById.js";
import getCertificates from "./getCertificates.js";
import getCurrentExpertInfo from "./getCurrentExpertInfo.js";
import getReviewsByExpertId from "./getReviewsByExpertId.js";
import getUnverifiedExpert from "./getUnverifiedExpert.js";
import getRecommendedJobRequestsForCurrentExpert from "./getRecommendedJobRequestsForCurrentExpert.js";
import getTopExperts from "./getTopExperts.js";
import getAcceptedJobRequests from "./getAcceptedJobRequests.js";
import getCurrentExpertMajors from "./getCurrentExpertMajors.js";
import getMajorsByExpertId from "./getMajorsByExpertId.js";
import deleteRecommendedJobRequest from "./deleteRecommendedJobRequest.js";
import createDocument from "./createDocument.js";
import getDocuments from "./getDocuments.js";
import getDocumentById from "./getDocumentById.js";
import updateDocument from "./updateDocument.js";
import deleteDocument from "./deleteDocument.js";
import getWithdrawalRequests from "./getWithdrawalRequests.js";
import getBankAccount from "./getBankAccount.js";
import updateBankAccount from "./updateBankAccount.js";

export default {
  "/experts": {
    ...getAllExperts,
  },
  "/experts/top": {
    ...getTopExperts,
  },
  "/experts/unverified": {
    ...getUnverifiedExpert,
  },
  "/experts/current": {
    ...getCurrentExpertInfo,
  },
  "/experts/current/majors": {
    ...getCurrentExpertMajors,
  },
  "/experts/current/recommended-job-requests": {
    ...getRecommendedJobRequestsForCurrentExpert,
  },
  "/experts/current/recommended-job-requests/{job_request_id}": {
    ...deleteRecommendedJobRequest,
  },
  "/experts/current/accepted-job-requests": {
    ...getAcceptedJobRequests,
  },
  "/experts/current/withdrawal-requests": {
    ...getWithdrawalRequests,
  },
  "/experts/current/bank-account": {
    ...getBankAccount,
    ...updateBankAccount,
  },
  "/experts/{expert_id}": {
    ...getExpertInfoById,
  },
  "/experts/{expert_id}/certificates": {
    ...getCertificates,
  },
  "/experts/{expert_id}/majors": {
    ...getMajorsByExpertId,
  },
  "/experts/{expert_id}/reviews": {
    ...getReviewsByExpertId,
  },
  "/experts/{expert_id}/documents": {
    ...createDocument,
    ...getDocuments,
  },
  "/experts/{expert_id}/documents/{document_id}": {
    ...getDocumentById,
    ...updateDocument,
    ...deleteDocument,
  },
};
