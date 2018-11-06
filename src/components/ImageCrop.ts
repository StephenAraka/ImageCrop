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

type aspectRatioOptions = "freeCrop" | "square" | "landscape1" | "landscape2" | "portrait1" | "portrait2";
export interface ImageCropProps {
    aspectRatio?: aspectRatioOptions;
    editable?: boolean;
    keepSelection?: boolean;
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
    imageUrl: string;
    rotate: number;
    saveImage(imageUrl?: string): void;
}

export interface ImageCropState {
    crop?: Crop;
    image: string;
    enabled: boolean;
    imageUrl: string;
    angleInDegrees: number;
}

export class ImageCrop extends Component<ImageCropProps, ImageCropState> {
    private targetImage: HTMLImageElement;

    constructor(props: ImageCropProps) {
        super(props);
        this.state = {
            crop: {
                x: 20,
                y: 20,
                width: this.props.minWidth,
                height: this.props.minHeight
            },
            image: "",
            enabled: false,
            imageUrl: props.imageUrl,
            angleInDegrees: 0
        };

    }

    componentWillReceiveProps(newProps: ImageCropProps) {
            this.setState({ imageUrl: newProps.imageUrl });
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
                src: this.state.imageUrl,
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
            ,
            createElement("button", {
                className: "btn btn-default",
                onClick: this.rotateRight
            }, "Rotate Right"),
            createElement("button", {
                className: "btn btn-default",
                onClick: this.rotateLeft
            }, "Rotate Left")
        );
    }

    private onImageLoaded = (target: HTMLImageElement) => {
        this.getAspectRatio();
        this.targetImage = target;
    }

    private onChange = (crop: Crop) => {
        this.setState({ crop });
    }

    private onComplete = (_crop: Crop, pixelCrop: PixelCrop) => {
        this.setState({ enabled: true });
        this.setState({ image: this.convertCanvasToImage(pixelCrop) as string });
        this.props.saveImage(this.state.image);
    }

    private getCroppedImg = (image: any, pixelCrop: PixelCrop) => {
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
        return canvas;
    }

    private resetCrop = () => {
        this.setState({ crop: undefined });
    }

    private rotateRight = (pixelCrop: PixelCrop) => {
        this.setState({ angleInDegrees: (this.state.angleInDegrees + 90) % 360 });
        this.drawRotated(this.state.angleInDegrees, pixelCrop);
    }

    private rotateLeft = (pixelCrop: PixelCrop) => {
        if (this.state.angleInDegrees === 0) {
            this.setState({ angleInDegrees: 270 });
        } else {
            this.setState({ angleInDegrees: (this.state.angleInDegrees - 90) % 360 });
        }
        this.drawRotated(this.state.angleInDegrees, pixelCrop);
    }

    private drawRotated = (degrees: number, pixelCrop: PixelCrop) => {
        const image = this.targetImage;
        const canvas = this.getCroppedImg(image, pixelCrop);

        const ctx = canvas.getContext("2d");
        canvas.style.width = "20%";

        if (degrees === 90 || degrees === 270) {
            canvas.width = image.height;
            canvas.height = image.width;
        } else {
            canvas.width = image.width;
            canvas.height = image.height;
        }
        if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (degrees === 90 || degrees === 270) {
            ctx.translate(image.height / 2, image.width / 2);
        } else {
            ctx.translate(image.width / 2, image.height / 2);
        }
        ctx.rotate(degrees * Math.PI / 180);
        ctx.drawImage(image, -image.width / 2, -image.height / 2);
    }
        const rotatedCanvas = canvas.toDataURL("image/png");
        this.setState({ imageUrl: rotatedCanvas });
    }

    private convertCanvasToImage = (pixelCrop: PixelCrop) => {
        const croppedImage: HTMLImageElement = new Image();
        if (this.targetImage) {
            croppedImage.src = this.getCroppedImg(this.targetImage, pixelCrop).toDataURL("image/png");
            return croppedImage.src;
        }
    }

    private getAspectRatio = () => {
        const { aspectRatio, minHeight, minWidth } = this.props;
        if (aspectRatio === "square") {
            this.setState({
                crop: {
                    aspect: 1 / 1,
                    x: 20,
                    y: 20,
                    width: minWidth,
                    height: minHeight
                }
            });
        } else if (aspectRatio === "portrait1") {
            this.setState({
                crop: {
                    aspect: 2 / 3,
                    x: 20,
                    y: 20,
                    width: minWidth,
                    height: minHeight
                }
            });
        } else if (aspectRatio === "portrait2") {
            this.setState({
                crop: {
                    aspect: 4 / 5,
                    x: 20,
                    y: 20,
                    width: minWidth,
                    height: minHeight
                }
            });
        } else if (aspectRatio === "landscape1") {
            this.setState({
                crop: {
                    aspect: 16 / 9,
                    x: 20,
                    y: 20,
                    width: minWidth,
                    height: minHeight
                }
            });
        } else if (aspectRatio === "landscape2") {
            this.setState({
                crop: {
                    aspect: 12 / 6,
                    x: 20,
                    y: 20,
                    width: minWidth,
                    height: minHeight
                }
            });
        } else {
            this.setState({
                crop: {
                    x: 20,
                    y: 20,
                    width: minWidth,
                    height: minHeight
                }
            });
        }
    }
}

export default ImageCrop;
