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
    dataUrl: string;
    aspectRatio?: aspectRatioOptions;
    editable?: boolean;
    keepSelection?: boolean;
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
    imageUrl: string;
    alertMessage?: string;
    saveImage(imageUrl?: string): void;
}

export interface ImageCropState {
    crop?: Crop;
    image: string;
    imageUrl: string;
    imageIsLoaded: boolean;
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
            imageUrl: props.imageUrl,
            imageIsLoaded: false
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
                className: "btn btn-info",
                onClick: this.rotateImage
            },
            createElement("span", { className: "glyphicon glyphicon-refresh" }), "Rotate")
            );
    }

    private onImageLoaded = (target: HTMLImageElement) => {
        if (this.state.imageIsLoaded === false) {
            this.getAspectRatio();
            this.targetImage = target;
            this.setState({ imageIsLoaded: true });
        } else return;
    }

    private onChange = (crop: Crop, _pixelCrop: PixelCrop) => {
        this.setState({ crop });
    }

    private onComplete = (_crop: Crop, pixelCrop: PixelCrop) => {
        this.props.saveImage(this.convertCanvasToImage(pixelCrop));
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

    private rotateImage = (pixelCrop: PixelCrop) => {
        let angleInDegrees = 0;
        angleInDegrees = (angleInDegrees + 90) % 360;
        this.drawRotated(angleInDegrees, pixelCrop);
    }

    private drawRotated = (degrees: number, pixelCrop: PixelCrop) => {
        const image = this.targetImage;
        const canvas = this.getCroppedImg(image, pixelCrop);

        const ctx = canvas.getContext("2d");
        canvas.style.width = "20%";
        const isHorizontal = (degrees === 90 || degrees === 270);
        canvas.width = isHorizontal ? image.height : image.width;
        canvas.height = isHorizontal ? image.width : image.height;

        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (isHorizontal) {
                ctx.translate(image.height / 2, image.width / 2);
            } else {
                ctx.translate(image.width / 2, image.height / 2);
            }
            ctx.rotate(degrees * Math.PI / 180);
            ctx.drawImage(image, -image.width / 2, -image.height / 2);
        }
        const rotatedCanvas = canvas.toDataURL("image/png");
        const croppedImage = new Image();
        croppedImage.src = rotatedCanvas;
        this.setState({ imageUrl: croppedImage.src });
        return croppedImage.src;
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
        let imageAspectRatio;
        if (aspectRatio === "freeCrop") {
            this.setState({
                crop: {
                    x: 20,
                    y: 20,
                    width: minWidth,
                    height: minHeight
                }
            });
        } else if (aspectRatio === "square") {
            imageAspectRatio = 1 / 1;
        } else if (aspectRatio === "portrait1") {
            imageAspectRatio = 2 / 3;
        } else if (aspectRatio === "portrait2") {
            imageAspectRatio = 4 / 5;
        } else if (aspectRatio === "landscape1") {
            imageAspectRatio = 16 / 9;
        } else if (aspectRatio === "landscape2") {
            imageAspectRatio = 12 / 6;
        }
        this.setState({
            crop: {
                aspect: imageAspectRatio,
                x: 20,
                y: 20,
                width: minWidth,
                height: minHeight
            }
        });
    }
}

export default ImageCrop;
