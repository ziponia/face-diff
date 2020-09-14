import React, {useEffect, useRef, useState} from "react";
import {Col, Image} from "react-bootstrap";
import axios from 'axios';

type Props = {
    file?: File;
    mask?: boolean;
};

const ImageLoader: React.FC<Props> = (props) => {

    const [loadImage, setLoadImage] = useState<string>();

    useEffect(() => {
        console.log(loadImage);
    }, [loadImage])

    const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const {files} = e.dataTransfer;
        if (files.length !== 1) return;
        const file = files[0];

        await generateThumbnail(file);
    }

    const generateThumbnail = async (file: File) => {
        const f = new FormData();
        f.set('file', file);
        const {data} = await axios.post('/api/thumbnail-generate', f, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        setLoadImage(data);
    }

    return (
        <Col className="image-wrap">
            <div className={`mask-container ${props.mask && 'mask'}`} onDrop={onDrop}>
                이곳에 비교 할 파일을 놓으세요
                {loadImage && <Image src={loadImage}/>}
            </div>
        </Col>
    )
};

ImageLoader.defaultProps = {
    mask: false
}

export default ImageLoader;
