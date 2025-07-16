const multer = require("multer");
const multerS3 = require("multer-s3");
const { s3 } = require("../../configs/aws.config");
const { AWS_S3_BUCKET_NAME } = require("../../configs/server.config");
const { randomString } = require("./common.util");

const uploadFile = multer({
  storage: multerS3({
    s3: s3,
    bucket: AWS_S3_BUCKET_NAME,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const newFileName = Date.now() + file.originalname.replace(/\s+/g, "_");
      const fullPath = file.fieldname+"/" + newFileName;
      cb(null, fullPath);
    },
  }),
})


module.exports = {
  uploadFile,
};
