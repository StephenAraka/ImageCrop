declare module "react-image-crop" {

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

    export interface ReactCropProps {
        src: string;
        crop?: Crop;
        onChange?: (crop: Crop, pixelCrop: PixelCrop) => void;
        onComplete?: (crop: Crop, pixelCrop: PixelCrop) => void;
    }

    export const ReactCrop: React.ComponentClass<ReactCropProps>;

    export { ReactCrop as default };
}