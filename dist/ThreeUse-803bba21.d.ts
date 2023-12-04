import { ColorRepresentation, Scene, PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface CreateAppOptions {
  /**
   * 画布颜色
   * @defaultValue #181818
   */
  clearColor?: ColorRepresentation

  /**
   * 相机初始位置
   * @defaultValue [0, 0, 0]
   */
  cameraPosition?: [number, number, number]
  /**
   * 控制器target初始位置
   * @defaultValue [0, 0, 0]
   */
  targetPosition?: [number, number, number]
  
  /**
   * 相机fov参数
   * @defaultValue 75
   */
  fov?: number
  /**
   * 相机aspect参数
   * @defaultValue 16/9
   */
  aspect?: number
  /**
   * 相机near参数
   * @defaultValue 0.1
   */
  near?: number
  /**
   * 相机far参数
   * @defaultValue 1000
   */
  far?: number
}

interface InstallFunction {
    (app: ThreeUse, ...options: any[]): void;
}
type Plugin = {
    install: InstallFunction;
} | InstallFunction;
declare class ThreeUse {
    private _container;
    private _renderer;
    private _scene;
    private _camera;
    private _controls;
    private _resizeObserver;
    private _size;
    private _customRender;
    private _setSize;
    private _setCamera;
    private _resize;
    private _render;
    globalProperties: Record<string | symbol, any>;
    constructor(options?: CreateAppOptions);
    getDom(): Element;
    getControls(): OrbitControls;
    getScene(): Scene;
    getCamera(): PerspectiveCamera;
    use(plugin: Plugin, ...options: any[]): this;
    mount(rootContainer: Element | string): this;
    unmount(): this;
}

export { ThreeUse as T };
