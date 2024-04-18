import { Document } from "../models/index.js";
import cloudinaryService from "./cloudinaryService.js";

const createDocument = async ({ expert_id, name, description, file }) => {
  const response = await cloudinaryService.upload(file);
  const document = await Document.create({
    name,
    expert: expert_id,
    description,
    file_url: response.url,
    file_public_id: response.public_id,
  });

  return document;
};

const fetchDocumentById = async (expert_id, document_id) => {
  const document = await Document.findOne({
    _id: document_id,
    expert: expert_id,
  });
  return document;
};

const fetchDocumentsByExpertId = async (expert_id) => {
  const documents = await Document.find({
    expert: expert_id,
  });
  return documents;
};

const updateDocument = async ({
  expert_id,
  document_id,
  name,
  description,
}) => {
  const document = await Document.findOneAndUpdate(
    {
      _id: document_id,
      expert: expert_id,
    },
    {
      name,
      description,
    },
    {
      new: true,
    }
  );
  return document;
};

const deleteDocumentById = async (document_id, expert_id) => {
  const document = await Document.findOne({
    _id: document_id,
    expert: expert_id,
  });

  await cloudinaryService.deleteByPublicId(document.file_public_id);
  await Document.deleteOne({ _id: document_id, expert: expert_id });
};

export default {
  createDocument,
  fetchDocumentById,
  fetchDocumentsByExpertId,
  updateDocument,
  deleteDocumentById,
};
