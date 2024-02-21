import { T as ThreeUse } from './ThreeUse-e81179dd.js';
import 'three';

declare const stats: {
    install: (app: ThreeUse, options: [boolean?, boolean?]) => void;
};

type RangeItem = {
    min: number;
    max: number;
};
interface CameraRange {
    x: RangeItem;
    y: RangeItem;
    z: RangeItem;
}
declare const cameraRange: {
    install: (app: ThreeUse, options: [CameraRange?]) => void;
};

export { CameraRange, RangeItem, cameraRange, stats };
