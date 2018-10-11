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

    function makeAspectCrop(crop: Crop, imageAspect: number): Crop;

    export interface ReactCropProps {
        src: string;
        crop?: Crop;
        onChange?: (crop: Crop, pixelCrop: PixelCrop) => void;
        onComplete?: (crop: Crop, pixelCrop: PixelCrop) => void;
        onImageLoaded?: (target: HTMLImageElement) => void;
    }

    export const ReactCrop: React.ComponentClass<ReactCropProps>, makeAspectCrop;

    export { ReactCrop as default };
}