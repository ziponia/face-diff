import {NextApiRequest, NextApiResponse} from "next";
import formidable from "formidable";
import sharp from 'sharp';
import fs from 'fs';

export default async (req: NextApiRequest, res: NextApiResponse) => {

    const data = await new Promise<{
        fields: formidable.Fields;
        files: formidable.Files
    }>(((resolve, reject) => {
        const form = new formidable.IncomingForm();
        form.parse(req, ((err, fields, files) => {
            if (err) reject(err);
            resolve({fields, files});
        }))
    }))

    const { file } = data.files;
    console.log(file);
    const buf = await sharp(fs.readFileSync(file.path))
        .resize(400, 400)
        .toFormat('png')
        .toBuffer()

    const base64String =Buffer.from(buf).toString('base64');

    return res.status(200)
        .send(`data:${file.type};base64,` + base64String);
}

export const config = {
    api: {
        bodyParser: false,
    },
};
