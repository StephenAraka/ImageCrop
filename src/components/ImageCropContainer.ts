import { Component, createElement } from "react";
import ImageCrop, { editableType, imageSourceType } from "./ImageCrop";

interface WrapperProps {
  mxObject: mendix.lib.MxObject;
}

export interface ImageCropContainerProps extends WrapperProps {
  imageSource: imageSourceType;
  editable: editableType;
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
}

export default class ImageCropContainer extends Component<ImageCropContainerProps> {
  render() {
      return createElement(ImageCrop);
  }

  // private getImage(newProps: ImageCropContainerProps) {
  //   let image = "";
  //   const mxObject = this.props.mxObject;
  // //   this.props.imageSource === "localDatabase" ? image = mx.data.getDocumentUrl(mxObject.getGuid()) :
  // }
}
