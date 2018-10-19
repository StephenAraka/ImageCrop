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
    src: string;
    img: string;
}

export class ImageCrop extends Component<ImageCropProps, ImageCropState> {
    private image: HTMLImageElement;
    private ourImage: HTMLImageElement;
    // private canvasNode!: HTMLCanvasElement;
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
                onDragEnd: this.DragCrop,
                onChange: this.onChange,
                onImageLoaded: this.onImageLoaded
            }),
            createElement("img", { src: this.state.img })
        );
    }

    private onChange = (crop: Crop) => {
        this.setState({ crop });
        const reader = new FileReader();
        reader.onload = () => {
            this.setState({ src: reader.result as string });
        };
        return createElement("img", { src: this.state.src });
    }

    private DragCrop = (crop: Crop, pixelCrop: PixelCrop) => {
        if (onmousedown) {
      this.convertCanvasToImage(pixelCrop);
        } else {
            window.alert("onDrag" + { crop, pixelCrop });
            this.image = this.convertCanvasToImage(pixelCrop);
            this.setState({ img: this.image.src });
        }
    }

    private onImageLoaded = (target: HTMLImageElement) => {
        this.ourImage = target;
        // tslint:disable-next-line:no-console
        console.log(target);
    }

    // {File} image - Image File Object
    // {Object} pixelCrop - pixelCrop Object provided by react-image-crop
    // {String} fileName - Name of the returned file in Promise
    getCroppedImg = (image: any, pixelCrop: PixelCrop, _fileName: string) => {
        const canvas = document.createElement("canvas");
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
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
        return canvas;
    }

    convertCanvasToImage = (pixelCrop: PixelCrop) => {
    const image3: HTMLImageElement = new Image();
    image3.src = this.getCroppedImg(this.ourImage, pixelCrop, "x").toDataURL("image/png");
    return image3;
}

}

export default ImageCrop;
