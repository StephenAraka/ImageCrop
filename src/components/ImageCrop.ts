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

type aspectRatioOptions = "square" | "cover";
export interface ImageCropProps {
    aspectRatio?: aspectRatioOptions;
    editable?: boolean;
    keepSelection?: boolean;
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
    imageUrl: string;
    saveImage(imageUrl?: string): void;
}

export interface ImageCropState {
    crop?: Crop;
    image: string;
    enabled: boolean;
}

export class ImageCrop extends Component<ImageCropProps, ImageCropState> {
    private targetImage!: HTMLImageElement;

    constructor(props: ImageCropProps) {
        super(props);
        this.state = {
            crop: {
                x: 20,
                y: 10,
                width: 40,
                height: 40
            },
            image: "",
            enabled: false
        };

    }

    render() {
        return createElement("div",
            { className: "react-crop-wrapper" },
            createElement(ReactCrop, {
                className: "react-crop",
                disabled: this.props.editable,
                keepSelection: this.props.keepSelection,
                onComplete: this.onComplete,
                crop: this.state.crop,
                src: this.props.imageUrl,
                onChange: this.onChange,
                onImageLoaded: this.onImageLoaded,
                minWidth: this.props.minWidth,
                minHeight: this.props.minHeight,
                maxWidth: this.props.maxWidth,
                maxHeight: this.props.maxHeight
            }),
            createElement("button", {
                className: "btn btn-default",
                onClick: this.resetCrop,
                style: { visibility: this.state.enabled === false ? "hidden" : "visible" }
            }, "Cancel")
        );
    }

    private onImageLoaded = (target: HTMLImageElement) => {
        this.targetImage = target;

        const { minWidth, minHeight, maxWidth, maxHeight, aspectRatio } = this.props;
        if (minWidth && minHeight && maxWidth && maxHeight && maxWidth > minWidth && maxHeight > minHeight) {
            if (aspectRatio === "square") {
                this.setState({
                    crop: {
                        aspect: 4 / 3,
                        x: 20,
                        y: 20,
                        width: minWidth,
                        height: minHeight
                    }
                });
            } else if (aspectRatio === "cover") {
                this.setState({
                    crop: {
                        aspect: 16 / 9,
                        x: 20,
                        y: 20,
                        width: minWidth,
                        height: minHeight
                    }
                });
            }
        }
    }

    private onChange = (crop: Crop) => {
        this.setState({ crop });
    }

    private onComplete = (pixelCrop: PixelCrop) => {
        this.setState({ image: this.convertCanvasToImage(pixelCrop) as string });
        this.props.saveImage(this.state.image);
    }

    private getCroppedImg = (image: any, pixelCrop: PixelCrop) => {
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
        const croppedImage: HTMLImageElement = new Image();
        if (this.targetImage) {
            croppedImage.src = this.getCroppedImg(this.targetImage, pixelCrop).toDataURL("image/png");
            return croppedImage.src;
        }
    }
}

export default ImageCrop;
