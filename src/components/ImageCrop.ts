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
    // pixelCrop: PixelCrop;
    // disabled: boolean;
}

export class ImageCrop extends Component<ImageCropProps, ImageCropState> {

    constructor(props: ImageCropProps) {
        super(props);
        this.state = {
            crop: {
                x: 20,
                y: 10,
                width: 40,
                aspect: 16 / 9
            }
        };
    }
    render() {
        return createElement("div", { className: "react-image-wrapper" },
            createElement(ReactCrop, {
                className: "",
                crop: this.state.crop,
                src: this.props.imageUrl,
                onChange: this.onCropChange,
                onImageLoaded: this.onImageLoaded,
                onComplete: () => this.onCropComplete
            })
        );
    }

    private onImageLoaded = (image?: any, pixelCrop?: any) => {
        console.log("onImageLoaded", { image, pixelCrop }); // tslint:disable-line
        // this.setState({
        //   crop: makeAspectCrop({
        //     x: 0,
        //     y: 0,
        //     aspect: 10 / 4,
        //     width: 50,
        //   }, image.naturalWidth / image.naturalHeight),
        //   image,
        // });
      }
    private onCropComplete = (crop: Crop) => {
        console.log("onCropComplete", crop); // tslint:disable-line
    }

    private onCropChange = (crop: Crop) => {
        this.setState({ crop });
    }

}

export default ImageCrop;
