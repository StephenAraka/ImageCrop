import { Component, createElement } from "react";
import "react-image-crop/lib/ReactCrop.scss";

export type editableType = "default" | "never";
export interface ImageCropProps {
  imageUrl?: string;
}

class ImageCrop extends Component<ImageCropProps, {}> {
  render() {
      return createElement("div", { className: "react-image-wrapper" },
        createElement("img", { src: this.props.imageUrl })
        );
  }
}

export default ImageCrop;
