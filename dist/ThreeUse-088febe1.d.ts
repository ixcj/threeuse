import * as THREE from 'three';
import { WebGLRenderer, Scene, PerspectiveCamera } from 'three';

interface CreateAppOptions {
  /**
   * 画布颜色
   * @defaultValue #181818
   */
  clearColor?: THREE.ColorRepresentation

  /**
   * 相机初始位置
   * @defaultValue [0, 0, 0]
   */
  cameraPosition?: [number, number, number]
  
  /**
   * 相机fov参数
   * @defaultValue 35
   */
  fov?: number
  /**
   * 相机aspect参数
   * @defaultValue 16/9
   */
  aspect?: number
  /**
   * 相机near参数
   * @defaultValue 0.5
   */
  near?: number
  /**
   * 相机far参数
   * @defaultValue 10000
   */
  far?: number
  /**
   * 色彩空间
   * @defaultValue THREE.LinearSRGBColorSpace
   */
  outputColorSpace?: THREE.ColorSpace
}

interface InstallFunction {
    (app: ThreeUse, ...options: any[]): void;
}
type ObserverTyep = 'mount' | 'unmount' | 'resize';
type ObserverBehavior = {
    [type in ObserverTyep]?: Function;
};
type Plugin = {
    install: InstallFunction;
} | InstallFunction;
declare class ThreeUse {
    private _renderer;
    private _scene;
    private _camera;
    private _controls;
    constructor(options?: CreateAppOptions);
    private _container;
    private _resizeObserver;
    private _subscribe;
    private _size;
    mounted: boolean;
    globalProperties: Record<string | symbol, any>;
    private _customRender;
    private _setSize;
    private _setCamera;
    private _render;
    private _notify;
    private _resize;
    getRenderer(): WebGLRenderer;
    getDom(): HTMLCanvasElement;
    getContainer(): Element;
    getControls(): any;
    getScene(): Scene;
    getCamera(): PerspectiveCamera;
    setControls(controls: any): this;
    use(plugin: Plugin, ...options: any[]): this;
    mount(rootContainer: Element | string): this;
    unmount(): this;
    subscribe(behavior: ObserverBehavior, key?: Symbol | string): Symbol | string;
    unSubscribe(key: Symbol | string): void;
}

export { ThreeUse as T };
