import certificateService from "../services/certificateService.js";

const createCertificate = async (req, res, next) => {
  try {
    const user_id = req.authData.user._id;
    const { name, major_id, descriptions } = req.body;
    const photo = req.file;
    const certificate = await certificateService.createCertificate({
      user_id,
      name,
      major_id,
      descriptions,
      photo,
    });
    res.json({ certificate });
  } catch (error) {
    next(error);
  }
};

const deleteCertificate = async (req, res, next) => {
  try {
    const user_id = req.authData.user._id;
    const certificate_id = req.params.certificate_id;
    await certificateService.deleteCertificateById(user_id, certificate_id);
    res.json({ message: "Delete certificate successfully" });
  } catch (error) {
    next(error);
  }
};

const verifyCertificate = async (req, res, next) => {
  try {
    const certificate_id = req.params.certificate_id;
    const certificate = await certificateService.verifyCertificateById(
      certificate_id
    );
    res.json({ certificate });
  } catch (error) {
    next(error);
  }
};

export default { createCertificate, deleteCertificate, verifyCertificate };
