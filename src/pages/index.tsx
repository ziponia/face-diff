import React, {useEffect, useState} from "react";
import {NextPage} from "next";
import axios from "axios";
import {Col, Container, Row} from "react-bootstrap";
import ImageLoader from "../ImageLoader";

type Props = {};

interface FaceDiffResponse {
    ok: boolean;
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
    const [compareFiles, setCompareFiles] = useState<{
        source?: File;
        target?: File;
    }>({source: undefined, target: undefined});

    const [result, setResult] = useState<FaceDiffResponse>();

    const handleFileSubmitAsync = async () => {
        const f = new FormData();
        f.append("source", compareFiles?.source as any);
        f.append("target", compareFiles?.target as any);
        const {data} = await axios.post<FaceDiffResponse>("/api/face-diff", f, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        setResult(data);
    };

    const handleInputFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        if (e.target.files.length === 0) return;

        setCompareFiles({
            ...compareFiles,
            [e.target.name]: e.target.files[0],
        });
    };

    return (
        <Container style={{paddingTop: 100}}>
            <Row>
                <Col>
                    <h1 className="title">페이스 DIFF.</h1>
                </Col>
            </Row>

            <Row>
                <Col>
                    {<ImageLoader file={compareFiles.source}/>}
                </Col>
                <Col>
                    {<ImageLoader file={compareFiles.target}/>}
                </Col>
            </Row>

            <input type="file" name="source" onChange={handleInputFiles}/>
            <input type="file" name="target" onChange={handleInputFiles}/>

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

        </Container>
    );
};

export default IndexPage;
