import { RequestAnimationFrame } from './request-animation-frame';
import THREE from 'three';

const DEFAULT_RENDERER_PARAMS = {
  alpha: false,
  antialias: true,
  clearColor: 0xffffff,
  shadowMapEnabled: false,
};

export default class EmberThreeScene {
  camera = undefined;
  frameAcc = 0;
  frameTime = 16;
  raf = undefined;
  renderer = undefined;
  scene = undefined;
  stats = undefined;
  parentElement = undefined;
  mouse = new THREE.Vector2();
  resizeEventDelegate = undefined;
  mouseMoveDelegate = undefined;

  constructor({ rendererParams = {} } = {}) {
    this.scene = new THREE.Scene();
    this.updateRenderer({ rendererParams });
    this.resizeEventDelegate = () => this.resize();
    this.mouseMoveDelegate = e => this.onMouseMove(e);
    this.raf = new RequestAnimationFrame(this.render, this);
  }

  updateRenderer({ rendererParams }) {
    if (this.renderer) {
      this.renderer.dispose();
    }

    let rendererProps = { ...DEFAULT_RENDERER_PARAMS, ...rendererParams };
    this.renderer = new THREE.WebGLRenderer(rendererProps);
    this.renderer.setClearColor(rendererParams.clearColor);
    this.renderer.shadowMap.enabled = rendererParams.shadowMapEnabled;
    if (rendererParams.shadowMapType) {
      this.renderer.shadowMap.type = rendererParams.shadowMapType;
    }
  }
  start() {
    this.raf.start();
  }

  stop() {
    this.raf.stop();
  }

  addRafCallback(callbackFunction, context) {
    this.raf.addCallback(callbackFunction, context);
  }

  setCamera(camera) {
    this.camera = camera;
    this.resize();
  }

  setStats(stats) {
    this.stats = stats;
  }

  render(dt) {
    if (this.stats) {
      this.stats.begin();
    }

    this.frameAcc += dt;

    if (this.frameAcc > this.frameTime && this.camera) {
      this.frameAcc = 0;
      this.renderer.render(this.scene, this.camera);
    }

    if (this.stats) {
      this.stats.end();
    }
  }

  dispose() {
    window.removeEventListener('resize', this.resizeEventDelegate);
    this.parentElement.removeEventListener('mousemove', this.mouseMoveDelegate, false);
    this.parentElement.removeChild(this.domElement);
    this.stop();
    this.raf.dispose();
    this.scene.dispose();
    this.renderer.dispose();
    this.preRenderCallback = undefined;
  }

  resize() {
    if (!this.parentElement) {
      return;
    }

    this.renderer.setSize(this.parentWidth, this.parentHeight);
    if (this.camera) {
      this.camera.aspect = this.parentWidth / this.parentHeight;
      this.camera.updateProjectionMatrix();
    }
  }

  onMouseMove(event) {
    event.preventDefault();
    this.mouse.x = (event.clientX / this.parentWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / this.parentHeight) * 2 + 1;
  }

  onInsertElement(parentElement) {
    this.parentElement = parentElement;
    this.parentElement.appendChild(this.domElement);
    this.resize();

    this.parentElement.removeEventListener('mousemove', this.mouseMoveDelegate, false);
    this.parentElement.addEventListener('mousemove', this.mouseMoveDelegate, false);

    window.removeEventListener('resize', this.resizeEventDelegate);
    window.addEventListener('resize', this.resizeEventDelegate);

    console.log('onInsertElement', parentElement);
  }

  get domElement() {
    return this.renderer.domElement;
  }

  get parentHeight() {
    return this.parentElement.offsetHeight;
  }
  get parentWidth() {
    return this.parentElement.offsetWidth;
  }
}
