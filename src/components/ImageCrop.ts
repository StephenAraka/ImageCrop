import { Component, createElement } from "react";

export type editableType = "default" | "never";
export interface ImageCropProps {
  imageUrl?: string;
  // editable: editableType;
  // minWidth: number;
  // minHeight: number;
  // maxWidth: number;
  // maxHeight: number;

}

class ImageCrop extends Component<ImageCropProps, {}> {
  render() {
      return createElement("div", { className: "react-image-wrapper" },
        createElement("img", { src: this.props.imageUrl })
        );
  }
}

export default ImageCrop;
