import { Component, createElement } from "react";
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
    minWidth: number;
    minHeight: number;
    maxWidth: number;
    maxHeight: number;
    imageUrl: string;
    onClickAction(imageUrl?: string): void;
}

export interface ImageCropState {
    crop?: Crop;
    img: string;
    enabled: boolean;
}

export class ImageCrop extends Component<ImageCropProps, ImageCropState> {
    ourImage!: HTMLImageElement;
    CanvasNode!: HTMLImageElement;
    pixelCrop: PixelCrop;
    crop: Crop;
    // private ReactCrop: any;

    constructor(props: ImageCropProps) {
        super(props);
        this.state = {
            crop: {
                x: 20,
                y: 10,
                width: 400
            },
            img: "",
            enabled: false
        };

    }

    render() {
        return createElement("div",
            { className: "react-crop-wrapper" },
            createElement(ReactCrop, {
                className: "react-crop",
                // minWidth: this.props.minWidth,
                // minHeight: this.props.minHeight,
                // maxWidth: this.props.maxWidth,
                // maxHeight: this.props.maxHeight,
                onComplete:  this.onComplete,
                crop: this.state.crop,
                src: this.props.imageUrl,
                onChange: this.onChange,
                onImageLoaded: this.onImageLoaded
            }),
            createElement("button", {
                className: "btn btn-default",
                onClick: this.resetCrop,
                style: { visibility: this.state.enabled === false ? "hidden" : "visible" }
            }, "Cancel")
        );
    }

    // private handleClick = () => {
    // //  this.onComplete(this.crop, this.pixelCrop);
    // this.props.onClickAction(this.state.img);
    // }

    private onImageLoaded = (target: HTMLImageElement) => {
        this.ourImage = target;
    }

    private onChange = (crop: Crop) => {
        this.setState({ enabled: true });
        this.setState({ crop });
    }

    private onComplete = (_crop: Crop, pixelCrop: PixelCrop) => {
        this.setState({ img: this.convertCanvasToImage(pixelCrop) as string });
    }

    private getCroppedImg = (image: any, pixelCrop: PixelCrop, _fileName?: string) => {
        const canvas = document.createElement("canvas");
        if (pixelCrop) {
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        }
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
        return canvas;
    }

    private resetCrop = () => {

        this.setState({ crop: undefined });
    }

    private convertCanvasToImage = (pixelCrop: PixelCrop) => {
        const image3: HTMLImageElement = new Image();
        if (this.ourImage) {
            image3.src = this.getCroppedImg(this.ourImage, pixelCrop, "x").toDataURL("image/png");
            return image3.src;
        }
    }
}

export default ImageCrop;
