import { Component, createElement } from "react";
// import ReactDOM from "react-dom";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import "../ui/ImageCrop.css";

export interface PixelCrop {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface Crop {
    aspect?: number;
    x: number;
    y: number;
    width?: number;
    height?: number;
}
export interface ImageCropProps {
    imageUrl: string;
}

export interface ImageCropState {
    crop: Crop;
}

class ImageCrop extends Component<ImageCropProps, ImageCropState> {

    constructor(props: ImageCropProps) {
        super(props);
        this.state = {
            crop: {
                x: 100,
                y: 100,
                width: 800,
                aspect: 16 / 9
            }
        };
    }

    render() {
        return createElement("div",
            { className: "react-crop-wrapper" },
            createElement(ReactCrop, {
                className: "react-crop",
                crop: this.state.crop,
                src: this.props.imageUrl,
                onComplete: this.onComplete,
                onChange: this.onChange
            })
        );
    }

    private onChange = (crop: Crop) => {
        this.setState({ crop });
    }

    private onComplete = (_crop: Crop, _pixelCrop: PixelCrop) => {
        console.log("onCropComplete"); // tslint:disable-line
      }
}

export default ImageCrop;
