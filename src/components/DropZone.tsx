import React, {useEffect, useState} from 'react';

type Props = {
    onDrop?: (e: DragEvent) => void;
    onDragging?: (dragging: boolean) => void;
}

const DropZone: React.FC<Props> = props => {

    const [dragging, setDragging] = useState(false);

    const onDragEnter = (e: DragEvent) => {
        e.stopPropagation();
    }

    const onDrag = (e: DragEvent) => {
        e.stopPropagation();
    }

    const onDrop = (e: DragEvent) => {
        e.preventDefault();
        props.onDrop && props.onDrop(e);
        setDragging(false);
    }

    const onDragOver = (e: DragEvent) => {
        e.preventDefault();
        if (!dragging) setDragging(true);
    }

    const onDragLeave = (e: DragEvent) => {
        e.preventDefault();
        setDragging(false);
    }

    useEffect(() => {
        props.onDragging && props.onDragging(dragging);
    }, [dragging])

    useEffect(() => {
        window.addEventListener('drop', onDrop);
        window.addEventListener('dragover', onDragOver);
        window.addEventListener('dragenter', onDragEnter);
        window.addEventListener('drag', onDrag);
        window.addEventListener('dragleave', onDragLeave);

        return () => {
            window.removeEventListener('drop', onDrop);
            window.removeEventListener('dragenter', onDragEnter);
            window.removeEventListener('dragover', onDragOver);
            window.removeEventListener('drag', onDrag);
            window.removeEventListener('dragleave', onDragLeave);
        }
    }, [])

    return (
        <React.Fragment>
            {props.children}
        </React.Fragment>
    )
}

export default DropZone;