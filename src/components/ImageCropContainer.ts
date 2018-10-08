import { Component, createElement } from "react";
import ImageCrop from "./ImageCrop";

type editableType = "default" | "never";
type onClickOptions = "doNothing" | "callMicroflow" | "showPage" | "openFullScreen";
type PageLocation = "content" | "popup" | "modal";
type ImageDataSource = "static" | "XPath" | "microflow";
interface WrapperProps {
  mxObject: mendix.lib.MxObject;
  mxform?: mxui.lib.form._FormBase;
  style?: string;
}

export interface ImageCropContainerProps extends WrapperProps {
  dataSource: ImageDataSource;
  dataUrl: string;
  editable: editableType;
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
  onClickMicroflow: string;
  onClickForm: string;
  onClickOption: onClickOptions;
  openPageAs: PageLocation;
  url: string;
  staticImages: object;
}

interface ImageCropContainerState {
  url: string;
}
export default class ImageCropContainer extends Component<ImageCropContainerProps, ImageCropContainerState> {

  constructor(props: ImageCropContainerProps) {
    super(props);
    this.state = {
      url: ""
    };

    this.convertBase64toBlob = this.convertBase64toBlob.bind(this);
  }

  render() {
    return createElement(ImageCrop, {
      dataUrl: this.convertBase64toBlob(this.state.url),
      imageUrl: "https://www.thewrap.com/wp-content/uploads/2018/05/deadpool-2-post-credits-scene.jpg"
    });
  }

  componentWillReceiveProps(newProps: ImageCropContainerProps) {
    this.setState({
      url: this.getAttributeValue(this.props.dataUrl, newProps.mxObject) as string
    });
  }

  private getAttributeValue(attributeName: string, mxObject?: mendix.lib.MxObject): string {
    return mxObject ? mxObject.get(attributeName) as string : "";
  }

  private convertBase64toBlob(base64Uri: string): Blob {
    const byteString = atob(base64Uri.split(";base64,")[1]);
    const bufferArray = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(bufferArray);

    for (let i = 0; i < byteString.length; i++) {
      uintArray[i] = byteString.charCodeAt(i);
    }

    return new Blob([ bufferArray ], { type: base64Uri.split(":")[0] });
  }

  public static validateProps(props: ImageCropContainerProps): string {
    let message = "";
    if (props.dataSource === "static" && !props.staticImages) {
      message = "For the data source option 'Static', at least one static image should be added";
    }
    if (props.dataSource === "XPath" && !props.dataSource) {
      message = "For the data source 'XPath', the images entity is required";
    }
    if (props.dataSource === "microflow" && !props.onClickMicroflow) {
      message = "For data source option 'microflow', a data source microflow is required";
    }

    return message;
  }
}
