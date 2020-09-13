import { NextApiRequest, NextApiResponse } from "next";
import AWS from "aws-sdk";
import formidable from "formidable";
import fs from "fs";

const recogClient = new AWS.Rekognition({
  region: "ap-northeast-2",
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const data = (await new Promise(function (resolve, reject) {
    const form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  })) as {
    fields: any;
    files: {
      source?: formidable.File;
      target?: formidable.File;
    };
  };

  const { source, target } = data.files;

  console.log(`
    Source Image Name: ${source?.path}, Size: [${source?.size}]
  `);
  console.log(`
    Target Image Name: ${target?.path}, Size: [${target?.size}]
  `);

  let response;

  try {
    response = await recogClient
      .compareFaces({
        SourceImage: {
          Bytes: fs.readFileSync(source?.path!),
        },
        TargetImage: {
          Bytes: fs.readFileSync(target?.path!),
        },
      })
      .promise();

    return res.json({
      ok: true,
      content: response.FaceMatches,
    });
  } catch (e) {
    console.error(e);
    return res.json({
      ok: false,
    });
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};
