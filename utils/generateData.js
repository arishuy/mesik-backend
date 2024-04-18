import mongoose from "mongoose";
import { User, ExpertInfo, Major, Certificate } from "../models/index.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import imageService from "../services/imageService.js";
import { roles } from "../config/constant.js";

dotenv.config();

const CONNECTION_URL = process.env.CONNECTION_URL;

await mongoose.connect(CONNECTION_URL);

const get_random = (list) => {
  return list[Math.floor(Math.random() * list.length)];
};

const middle_names = ["Văn", "Hữu", "Thị", "Đức"];
const first_names = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
const last_names = [
  "Nguyễn",
  "Phạm",
  "Bùi",
  "Trần",
  "Lê",
  "Phan",
  "Hoàng",
  "Huỳnh",
  "Hồ",
  "Dương",
  "Đỗ",
  "Ngô",
  "Đinh",
];

const addresses = [
  {
    city: {
      name: "Thành phố Hà Nội",
      code: 1,
    },
    district: {
      name: "",
      code: 0,
    },
    ward: {
      name: "",
      code: 0,
    },
    other_detail: "",
  },
  {
    city: {
      name: "Thành phố Đà Nẵng",
      code: 48,
    },
    district: {
      name: "",
      code: 0,
    },
    ward: {
      name: "",
      code: 0,
    },
    other_detail: "",
  },
  {
    city: {
      name: "Thành phố Hồ Chí Minh",
      code: 79,
    },
    district: {
      name: "",
      code: 0,
    },
    ward: {
      name: "",
      code: 0,
    },
    other_detail: "",
  },
];

const generateUsers = async (start, end) => {
  for (let i = start; i <= end; i++) {
    await User.create({
      first_name: `${get_random(middle_names)} ${get_random(first_names)}`,
      last_name: get_random(last_names),
      gender: get_random([true, false]),
      phone: `0${Math.floor(Math.random() * 900000000) + 100000000}`,
      address: get_random(addresses),
      email: `user${i}@test.com`,
      username: `testuser${i}`,
      encrypted_password: await bcrypt.hash(
        "123123123",
        parseInt(process.env.BCRYPT_SALT)
      ),
      isRestricted: get_random([true, false]),
      isConfirmed: get_random([true, false]),
    });
  }
  console.log(`generated ${end - start + 1} users`);
};

const generateExperts = async (start, end, major_id = null) => {
  const images = await imageService.getImages();
  const majors = await Major.find({});

  for (let i = start; i <= end; i++) {
    const user = await User.create({
      first_name: get_random(first_names),
      last_name: `${get_random(last_names)} ${get_random(middle_names)}`,
      gender: get_random([true, false]),
      phone: `0${get_random([3, 5, 7])}${
        Math.floor(Math.random() * 90000000) + 10000000
      }`,
      address: get_random(addresses),
      email: `expert${i}@test.com`,
      username: `expert${i}`,
      encrypted_password: await bcrypt.hash(
        `Expert@${i}`,
        parseInt(process.env.BCRYPT_SALT)
      ),
      role: roles.EXPERT,
      isRestricted: false,
      isConfirmed: true,
    });

    const certificates = [];
    if (major_id) {
      const photo = get_random(images);
      certificates.push(
        await Certificate.create({
          name: `expert-${i}_cert-0`,
          major: new mongoose.Types.ObjectId(major_id),
          descriptions: "test cert",
          photo_url: photo.url,
          photo_public_id: photo.public_id,
          isVerified: get_random([true, false]),
        })
      );
    } else {
      for (let j = 0; j < 3; j++) {
        const photo = get_random(images);
        const certificate = await Certificate.create({
          name: `expert-${i}_cert-${j}`,
          major: get_random(majors),
          descriptions: "test cert",
          photo_url: photo.url,
          photo_public_id: photo.public_id,
          isVerified: get_random([true, false]),
        });
        certificates.push(certificate);
      }
    }

    const expert = await ExpertInfo.create({
      user: user._id,
      descriptions: `test expert no.${i}`,
      average_rating: Math.random() * 5,
      rating_count: 1,
      certificates,
    });
    console.log(`generated ${expert}`);
  }
  console.log(`generated ${end - start + 1} experts`);
};

const deleteTestExperts = async () => {
  await Certificate.deleteMany({ descriptions: "test cert" });
  await ExpertInfo.deleteMany({ descriptions: /^test expert/ });
  await User.deleteMany({
    $and: [{ username: /^expert/ }, { username: { $ne: "expert02" } }],
  });
};

// await generateExperts(10, 50, "65574433f4354e1f8062acd6");
// await generateExperts(51, 80);

// await deleteTestExperts();

console.log("done");
