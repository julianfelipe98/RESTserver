const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const utilities = require("../utilities/utilities");
const noFilesFoundError = "No files found";
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const validExtentions = ["png", "jpg", "gif", "jpeg"];
const User = require("../models/user");
const Product = require("../models/product");
const { validateToken } = require("../middlewares/authentication");
//todos los archivos que se carguen caen sobre request.files
// se le pueden definir distintas configruraciones en el file upload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "uploads",
  })
);

app.put("/uploads/:type/:id", validateToken, (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0)
    return utilities.returnMessage(res, 400, false, noFilesFoundError);
  // el archivo es encontrara en la parte del req.files.fileName
  let sendedFile = req.files.file;
  let tempPath = sendedFile.tempFilePath;
  let fileExtention = sendedFile.name.split(".")[1];
  let imgType = req.params.type;
  //   allowed extentions
  if (validExtentions.includes(fileExtention)) {
    chooseImgType(imgType, req, res, tempPath);
  } else {
    utilities.returnMessage(res, 400, false, "no valid extention");
    cleanTempFolder(tempPath);
  }
});
let chooseImgType = (imgType, req, res, tempPath) => {
  //faltaria validar que a la hora de guardar la imagen de un producto , este mismo existe previamente en el sistema , porque hasta el momento se
  //  guarda la imagen primero en el servidor y despues se le asigna en la base de datos
  if (imgType === "users") {
    let userId = req.user._id;
    uploadSpecificImage(tempPath, res, userId,saveUserImg);
  } else {
    if (imgType === "products") {
      let productId = req.params.id;
      uploadSpecificImage(tempPath, res, productId,saveProductImg);
    } else {
      cleanTempFolder(tempPath);
      return utilities.returnMessage(res, 400, false, "no valid type");
    }
  }
};
let uploadSpecificImage = (tempPath, res, id,cb) => {
  uploadFile(tempPath, res)
    .then((img) => {
      cb(img, id, res);
    })
    .catch((err) => {
      cleanTempFolder();
      utilities.returnMessage(res, 500, false, err);
    });
};
let uploadFile = (tempPath, res) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(tempPath, (err, result) => {
      if (err) reject(err);
      resolve(result.url);
      cleanTempFolder(tempPath);
    });
  });
};
let cleanTempFolder = (tempPath) => {
  fs.unlink(tempPath, (err) => {
    if (err) throw err;
    console.log(`${tempPath} was removed from the tempFolder`);
  });
};

let saveUserImg = (imgURL, userId, res) => {
  let img = { img: imgURL };
  User.findByIdAndUpdate(
    userId,
    img,
    { new: true, runValidators: true },
    (err, userDB) => {
      if (err) return utilities.returnMessage(res, 400, false, err);
      return utilities.returnMessage(res, 200, true, userDB);
    }
  );
};

let saveProductImg = (imgURL, productId, res) => {
  Product.findById(productId, (err, productDB) => {
    if (err) return utilities.returnMessage(res, 500, false, err);
    if (!productDB) return utilities.returnMessage(res, 400, false, "No exist");
    productDB.img = imgURL;
    productDB.save((err, updatedUser) => {
      if (err) return utilities.returnMessage(res, 500, false, err);
      utilities.returnMessage(res, 200, true, updatedUser);
    });
  });
};

module.exports = app;
