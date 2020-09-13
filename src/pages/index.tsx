import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import axios from "axios";

type Props = {};

interface FaceDiffResponse {
  ok: true;
  content: [
    {
      Similarity: number;
      Face: {
        BoundingBox: {
          Width: number;
          Height: number;
          Left: number;
          Top: number;
        };
        Confidence: number;
        Landmarks: [
          { Type: "eyeLeft"; X: number; Y: number },
          { Type: "eyeRight"; X: number; Y: number },
          { Type: "mouthLeft"; X: number; Y: number },
          { Type: "mouthRight"; X: number; Y: number },
          { Type: "nose"; X: number; Y: number }
        ];
        Pose: {
          Roll: number;
          Yaw: number;
          Pitch: number;
        };
        Quality: {
          Brightness: number;
          Sharpness: number;
        };
      };
    }
  ];
}

const IndexPage: NextPage<Props> = (props) => {
  const [sourceFile, setSourceFile] = useState<File>();
  const [targetFile, setTargetFile] = useState<File>();

  const [result, setResult] = useState<FaceDiffResponse>();

  useEffect(() => {
    // handleFileSubmitAsync();
  }, []);

  const handleFileSubmitAsync = async () => {
    const f = new FormData();
    f.append("source", sourceFile as any);
    f.append("target", targetFile as any);
    const { data } = await axios.post<FaceDiffResponse>("/api/face-diff", f, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    setResult(data);
  };

  const handleInputFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    if (e.target.name === "diff-source") setSourceFile(e.target.files[0]);
    if (e.target.name === "diff-target") setTargetFile(e.target.files[0]);
  };

  return (
    <div>
      <input type="file" name="diff-source" onChange={handleInputFiles} />
      <input type="file" name="diff-target" onChange={handleInputFiles} />
      <button onClick={handleFileSubmitAsync}>업로드</button>

      {!!result && (
        <fieldset>
          <legend>결과</legend>
          <div>
            {!!result && result.content.length > 0 ? (
              <p>{result.content[0].Similarity}% 확률로 일치합니다!</p>
            ) : (
              <p> 흠... 전혀 다른 사진인 것 같네요...!</p>
            )}
          </div>
        </fieldset>
      )}
    </div>
  );
};

export default IndexPage;
