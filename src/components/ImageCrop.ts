import { Component, createElement } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/lib/ReactCrop.scss";
import "../ui/ImageCrop.css";

interface PixelCrop {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface Crop {
    aspect?: number;
    x: number;
    y: number;
    width?: number;
    height?: number;
}
export interface ImageCropProps {
    imageUrl: string;
    onChange?: (crop?: Crop, pixelCrop?: PixelCrop) => void;
}

interface ImageCropState {
    crop: Crop;
    pixelCrop: PixelCrop;
    maxHeight: number;
    disabled: boolean;
}

class ImageCrop extends Component<ImageCropProps, ImageCropState> {

    constructor(props: ImageCropProps) {
        super(props);
        this.state = {
            crop: { x: 10, y: 10, width: 80, height: 80 },
            pixelCrop: { x: 100, y: 100, width: 100, height: 100 },
            maxHeight: 80,
            disabled: true
        };
    }
    render() {
        return createElement("div",
            { className: "react-image-wrapper" },
            createElement(ReactCrop, {
                crop: this.state.crop,
                src: this.props.imageUrl,
                onChange: this.onCropChange,
                onImageLoaded: this.onImageLoaded,
                onComplete: this.onCropComplete
            })
            // createElement("input", { type: "button", value: "CropOFF", onClick: this.onButtonClick }),
            // createElement("input", { type: "button", value: "CropON", onClick: this.onButtonClick2 })
        );
    }

    onButtonClick = () => {
        this.setState({
            crop: {
                x: 20,
                y: 5,
                aspect: 1,
                height: 50
            },
            disabled: true
        });
    }

    onButtonClick2 = () => {
        this.setState({
            crop: {
                x: 20,
                y: 5,
                height: 20,
                width: 30
            },
            disabled: false
        });
    }

    private onImageLoaded = () => {
        console.log("onImageloaded", this.props.imageUrl); // tslint:disable-line
    }

    private onCropComplete = (crop: Crop) => {
        console.log("onCropComplete", crop); // tslint:disable-line
    }

    private onCropChange = (crop: Crop) => {
        this.setState({ crop });
    }
}

export default ImageCrop;
