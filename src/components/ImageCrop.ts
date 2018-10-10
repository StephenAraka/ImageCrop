import { Component, createElement } from "react";
// import * as ReactCrop from "react-image-crop";
import ReactCrop from "react-image-crop";

import "react-image-crop/lib/ReactCrop.scss";

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
}

class ImageCrop extends Component<ImageCropProps, ImageCropState> {

  constructor(props: ImageCropProps) {
    super(props);
    this.state = {
      crop: { x: 100, y: 100, width: 100, height: 100 },
      pixelCrop: {  x: 100, y: 100, width: 100, height: 100 }
    };
}
  render() {
    return createElement("div", { className: "react-image-wrapper" },
      createElement(ReactCrop, {
        crop: this.state.crop,
        src: this.props.imageUrl,
        onChange: this.onCropChange
      })
    );
  }

  onCropChange = (crop: Crop, _pixelCrop: PixelCrop) => {
    this.setState({ crop });
  }
}

export default ImageCrop;
