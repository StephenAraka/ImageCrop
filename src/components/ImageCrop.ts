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
    onClickAction(imageUrl?: string): void;
}

export interface ImageCropState {
    crop: Crop;
    src: string;
    img: string;
}

export class ImageCrop extends Component<ImageCropProps, ImageCropState> {
    ourImage!: HTMLImageElement;
    constructor(props: ImageCropProps) {
        super(props);
        this.state = {
            crop: {
                x: 20,
                y: 10,
                width: 400
            },
            src: this.props.imageUrl,
            img: ""
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
                onChange: this.onChange,
                onImageLoaded: this.onImageLoaded
            }),
            createElement("img", { src: this.state.img }),
            createElement("button", { className: "btn btn-primary", onClick: this.handleClick }, "Crop"));
    }

    private handleClick = (pixelCrop: PixelCrop, imagedataUrl?: string) => {
        // imagedataUrl = this.(pixelCrop); ---------------------- TODO: work on this
        if (this.props.onClickAction) {
            this.props.onClickAction(imagedataUrl);
        }
    }

    private onChange = (crop: Crop) => {
        this.setState({ crop });
        const reader = new FileReader();
        reader.onload = () => {
            this.setState({ src: reader.result as string });
        };
        return createElement("img", { src: this.state.src });
    }

    private onComplete = (_crop: Crop, pixelCrop: PixelCrop) => {
        // this.setState({ img: this.convertCanvasToImage(pixelCrop) as string }); ---------------------- TODO: work on this
    }

    private onImageLoaded = (target: HTMLImageElement) => {
        this.ourImage = target;
    }

    // {File} image - Image File Object
    // {Object} pixelCrop - pixelCrop Object provided by react-image-crop
    // {String} fileName - Name of the returned file in Promise
    private getCroppedImg = (image: any, pixelCrop: PixelCrop, _fileName?: string) => {
        const canvas = document.createElement("canvas");
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
            if (pixelCrop) {
                ctx.drawImage(
                    image,
                    pixelCrop.x,
                    pixelCrop.y,
                    pixelCrop.width,
                    pixelCrop.height,
                    0,
                    0,
                    pixelCrop.width,
                    pixelCrop.height
                );
            }
        }
        return canvas.toBlob(
            (canvasDataBlob) => {
                image = new Image();
                const url = window.URL.createObjectURL(canvasDataBlob);
                image.src = url;
            }
        );
    }
}

export default ImageCrop;
