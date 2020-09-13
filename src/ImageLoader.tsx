import React, {useEffect, useState} from "react";
import {Col, Image} from "react-bootstrap";

type Props = {
    file?: File;
};

const ImageLoader: React.FC<Props> = (props) => {

    const [loadImage, setLoadImage] = useState();

    const onDragEnter = (e: DragEvent) => {
        e.stopPropagation();
        console.log('dragstart')
    }

    const onDrag = (e: DragEvent) => {
        e.stopPropagation();
        console.log('onDrag')
    }

    const onDrop = (e: DragEvent) => {
        e.stopPropagation();
        e.preventDefault();
        console.log('onDrop')
    }

    const onDragOver = (e: DragEvent) => {
        e.stopPropagation();
        e.preventDefault();
        console.log('onDragOver')
    }

    useEffect(() => {
        window.addEventListener('dragenter', onDragEnter);
        window.addEventListener('dragover', onDragOver);
        window.addEventListener('drag', onDrag);
        window.addEventListener('drop', onDrop);

        return () => {
            window.removeEventListener('dragenter', onDragEnter);
            window.removeEventListener('dragover', onDragOver);
            window.removeEventListener('drag', onDrag);
            window.removeEventListener('drop', onDrop);
        }
    }, [])

    if (!loadImage) {
        return (
            <Col>
                <p>이곳에 파일을 놓으셍요.</p>
            </Col>
        )
    }

    return (
        <div>
            <Image src="holder.js/171x180" />
        </div>
    );
};

export default ImageLoader;
