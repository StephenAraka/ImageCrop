import { Component, createElement } from "react";
import ReactImageCrop from "./ReactImageCrop";

interface WrapperProps {
    mxObject?: mendix.lib.MxObject;
    mxform?: mxui.lib.form._FormBase;
}
export interface ReactImageCropContainerProps extends WrapperProps {
//   editable: default| never;
  maxWidth: number;
  minHeight: number;
}

export default class ReactImageCropContainer extends Component<ReactImageCropContainerProps, {}> {
  render() {
      return createElement(ReactImageCrop);
  }
}
