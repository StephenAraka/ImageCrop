import { Component, createElement } from "react";

interface ReactImageCropProps {
  sampleText: string;
}

class ReactImageCrop extends Component<ReactImageCropProps, {}> {
  render() {
      return createElement("div", {}, `ImageCrop ${this.props.sampleText}`);
  }
}

export default ReactImageCrop;
