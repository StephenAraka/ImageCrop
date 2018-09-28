import { Component, createElement } from "react";
import ReactImageCrop from "./ReactImageCrop";

export interface ReactImageCropContainerProps {
  sampleText: string;
}

export default class ReactImageCropContainer extends Component<ReactImageCropContainerProps, {}> {
  render() {
      return createElement(ReactImageCrop, {
          sampleText: this.props.sampleText
      });
  }
}
