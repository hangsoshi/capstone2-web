const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");

admin.initializeApp({
  credential: admin.credential.cert({
    type: "service_account",
    project_id: "capstone2-e7f77",
    private_key_id: "18146390917d770ff89f4f6e222a6c4973318229",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC8ws4HLj47L1Fo\nHh+zSyCfz0v/JjTw/DXMlVHsI3g9QYng7CZ6H16c645/74bTHXguXtso+3T53lVr\nGSBHFoL2dvIG8La8MB2tdpecCy7Pz3FtttDQGQnOwaZ4AeguB5J9l6JPWTlHwGKH\n7jQ6yth74zTcKEaopt3BO8WFlhq4sLrvjDFUnjGAr3bggvbn7Wbp7lj+BLLONCaG\nz/jfBcshsHyauVUqwXEFFHtrKNXXtqG9X5n+mjTaeHUsADf/WK+PvKZfxLi7dZr0\nIQoUGI0D9LOOogsFIa01QW3Hqk0w5c5RntPfHIcJGNUl3JeoCj14Ky8LdyOLqxP/\ne7+PG00JAgMBAAECggEAHlFybXLUVLCX9GTfle5bh2+bTEMNvns0BO/Niw5zZ0YE\nkwI7Io2xUPurarRv767MY95Lzeb9oI3rza+Ty0yRV8GTxDZGPi8YRTPxdq3RJK20\nEU7gy9vfAxIq3nGn949dzHBeMJKAgcbOd04fniXV5FLXuwN5Ez5MtexsywposQCN\nktIZEMz8bF0grJAyNIgpb6LPD+UswjKX+a0lg1UAuxSWQ7ZTrjyGnzF29lsiMBMa\noHz0Y47nXd3LdZEK1eQCg/bBsy0kXOU2pR2DGyL3sO8iVCO4hWEek6lfTzmNWLNY\nwF5bkJlr1Ajm2nxd/zbAecskvkQHAHHXuBPuzPSENQKBgQDy/CzmF3m+6eXfYm7i\n2nh7ECL/4kFLINZvPJdvBZd87gmgJeEPODJwl3ywAOwxk25s9+iOL6TJdP8ifF8a\nguKA/qkJwHwxaV03cSAHmXh1pghVMRpp8whxw9OoePGIKtfdZJFWvMARvTmj4209\nsX68hstu9oVKXFBPzgbkIjLxLwKBgQDG3xsBl6TPnt1QeDI3ZWWZuif9emDecmPE\ndvuasQG1DIFRp7dFBIrQYPHIYzCbNN9QNMFWpx2OsLMhuJ+ngOp8fQ3+dHWvjZeZ\n9MTWM25SE+GjGmW8RB4EJRLOgp+47jQ762FMCIR6e01loI5SxDVvTkTx3Oi0pyy3\nc5MfSffnRwKBgEW/VTQG8Q94HF/u5V2A0KyiiSliTNO/7U2o2t8nf8CAo4qw1NWF\nkBT5pvTujt38L+pfjwWhb2/UgZfok3QMte/JKcR+2Cdm0zci5crIpuc+bY3mtmpL\nNNVTHOJzNQGdKrGGOKHpNEjjRDRjB+x5kqOTHboQUVpy/SqrPRcnKfBJAoGBAKkN\n+WgmH7064AnK021R7cd7fwk0IeqXNQZK2uGKPNhKNBhUyS+Lh/FRp9dfsm8NyBPn\ndL8TusWUogI1bsq2hR6kM+Qt3ekJJWmDsFwiRlLRgcrj4r3i7d06Ir2YPuy22YJi\nOkinKO7xqD6O+M2U65Od5m/wCYWgYxvjzJoZh/p7AoGAEAxsaTcmpCl7LUi03ot5\ncS0MHhVSFLd3U95BYp3no7FROLtQe1i6Moj9bMiCA+xpYVAReWCP6OfadOAYgPDu\nFlJwCoTPTYG//jqzqu5PyO6TSCGCumxjq2HMFSvsTEQGeHQBe60Vn8XY3VaZh+C/\nMTEpnvlf2QtqSh8xIMTKZvU=\n-----END PRIVATE KEY-----\n",
    client_email:
      "firebase-adminsdk-jpvw6@capstone2-e7f77.iam.gserviceaccount.com",
    client_id: "114816963723939262766",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-jpvw6%40capstone2-e7f77.iam.gserviceaccount.com",
    universe_domain: "googleapis.com",
  }),
  storageBucket: "gs://capstone2-e7f77.appspot.com",
});

const firebase = {
  storage: admin.storage(),
  bucket: admin.storage().bucket(),
};

module.exports = async (request, response) => {
  try {
    const { directory } = request.body;
    const file = request.file;

    if (!request.file) {
      return response.status(400).json({
        code: 400,
        status: "failed",
        message: "No file included in request",
      });
    }

    const uuid = uuidv4();
    const blob = firebase.bucket.file(
      directory + "/" + uuid + "_" + file.originalname
    );
    const blobWriter = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
        metadata: {
          firebaseStorageDownloadTokens: uuid,
        },
      },
    });

    blobWriter.on("error", (error) => {
      return response.status(400).json({
        code: 400,
        status: "failed",
        message: error,
      });
    });

    blobWriter.on("finish", () => {
      const fileUrl =
        "https://firebasestorage.googleapis.com/v0/b/" +
        firebase.bucket.name +
        "/o/" +
        encodeURIComponent(blob.name) +
        "?alt=media&token=" +
        uuid;
      return response.status(200).json({
        code: 200,
        status: "success",
        data: {
          fileUrl,
          filename: directory + "/" + uuid + "_" + file.originalname,
        },
      });
    });

    blobWriter.end(file.buffer);
  } catch (error) {
    return response.status(500).json({
      code: 500,
      status: "failed",
      message: error,
    });
  }
};
