import createCertificate from "./createCertificate.js";
import deleteCertificate from "./deleteCertificate.js";
import verifyCertificate from "./verifyCertificate.js";

export default {
  "/certificates": {
    ...createCertificate,
  },
  "/certificates/{certificate_id}": {
    ...deleteCertificate,
  },
  "/certificates/{certificate_id}/verify": {
    ...verifyCertificate,
  },
};
