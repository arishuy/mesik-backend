import cloudinary from "../config/cloudinaryConfig.js";

const upload = async (file) => {
  const b64 = Buffer.from(file.buffer).toString("base64");
  let dataURI = "data:" + file.mimetype + ";base64," + b64;
  const res = await cloudinary.uploader.upload(dataURI, {
    resource_type: "auto",
  });
  return { public_id: res.public_id, url: res.secure_url };
};

const deleteByPublicId = async (public_id) => {
  await cloudinary.uploader.destroy(public_id);
};

const getImages = async (next_cursor = null) => {
  var result = [];
  var options = {
    resource_type: "image",
    folder: "",
    max_results: 500,
  };

  const listResources = async (next_cursor = null) => {
    if (next_cursor) {
      options["next_cursor"] = next_cursor;
    }
    try {
      const res = await cloudinary.api.resources(options);
      let more = res.next_cursor;
      let resources = res.resources;
      for (const resource of resources) {
        const url = resource.secure_url;
        const public_id = resource.public_id;
        result.push({ url, public_id });
      }

      if (more) {
        await listResources(more);
      }
    } catch (error) {
      console.log(error);
    }
  };
  await listResources(next_cursor);
  return result;
};

export default { upload, deleteByPublicId, getImages };
