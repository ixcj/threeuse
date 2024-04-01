import * as THREE from 'three';
import { WebGLRenderer, Scene, PerspectiveCamera, OrthographicCamera } from 'three';

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
   * 色彩空间
   * @defaultValue THREE.LinearSRGBColorSpace
   */
  outputColorSpace?: THREE.ColorSpace
}

interface InstallFunction {
    (app: ThreeUse, ...options: any[]): void;
}
type Listener = (...args: any[]) => void;
type Behavior = Record<string, Listener>;
type Plugin = {
    install: InstallFunction;
} | InstallFunction;
type Camera = PerspectiveCamera | OrthographicCamera;
declare class ThreeUse {
    private _renderer;
    private _scene;
    private _domElement;
    private _camera;
    private _container;
    private _controls;
    private _events;
    private _resizeObserver;
    private _size;
    mounted: boolean;
    enableCustomRender: boolean;
    globalProperties: Record<string | symbol, any>;
    constructor(options?: CreateAppOptions);
    private _customRender;
    private _setSize;
    private _render;
    private _resize;
    getRenderer(): WebGLRenderer;
    getDom(): HTMLCanvasElement;
    getScene(): Scene;
    getContainer(): Element;
    getControls<T = any>(): T;
    getCamera(): Camera;
    setControls<T>(controls: T): T;
    setCamera(camera: Camera): Camera;
    use(plugin: Plugin, ...options: any[]): this;
    mount(rootContainer: Element | string): this;
    unmount(): this;
    on(eventName: string, listener: Listener): void;
    off(eventName: string, listenerToRemove: Listener): void;
    send(eventName: string, ...args: any[]): void;
    subscribe(behavior: Behavior): void;
    unsubscribe(behavior: Behavior): void;
}

export { ThreeUse as T };
