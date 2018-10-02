import { Component, createElement } from "react";
import ReactImageCrop, { editableType, imageSourceType } from "./ReactImageCrop";

interface WrapperProps {
  mxObject: mendix.lib.MxObject;
}

export interface ReactImageCropContainerProps extends WrapperProps {
  imageSource: imageSourceType;
  editable: editableType;
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
}

export default class ReactImageCropContainer extends Component<ReactImageCropContainerProps> {
  render() {
      return createElement(ReactImageCrop);
  }

  private getImage(newProps: ReactImageCropContainerProps) {
    let image = "";
    const mxObject = this.props.mxObject;
    this.props.imageSource === "localDatabase" ? image = mx.data.getDocumentUrl(mxObject.getGuid()) :
  }
}
