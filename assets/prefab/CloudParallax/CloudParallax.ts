import {
  _decorator,
  Component,
  Node,
  randomRange,
  Prefab,
  UITransform,
  Sprite,
  Color,
  Vec3,
  instantiate,
} from "cc";
import { Cloud } from "./Cloud";
const { ccclass, property } = _decorator;

type CloudData = {
  node: Node;
  speed: number;
};

@ccclass("CloudParallax")
export class CloudParallax extends Component {
  @property(Prefab)
  cloudPrefab: Prefab = null;

  @property(Node)
  cloudContainer: Node = null;

  @property
  maxClouds: number = 10;

  @property
  spawnInterval: number = 2.0;

  private cloudPool: Node[] = [];
  private activeClouds: CloudData[] = [];
  private screenWidth: number = 0;
  private screenHeight: number = 0;

  onLoad() {
    const ui = this.node.getComponent(UITransform);
    this.screenWidth = ui.width;
    this.screenHeight = ui.height;

    for (let i = 0; i < this.maxClouds; i++) {
      const cloud = instantiate(this.cloudPrefab);
      cloud.setParent(this.cloudContainer);
      cloud.active = false;
      this.cloudPool.push(cloud);
    }
  }

  start() {
    this.schedule(this.spawnCloud, this.spawnInterval);
  }

  spawnCloud() {
    if (this.cloudPool.length === 0) return;

    const cloud = this.cloudPool.pop();

    const cloudScript = cloud.getComponent(Cloud);

    const randomType = Math.floor(Math.random() * cloudScript.variants.length);

    if (cloudScript) {
      cloudScript.setType(randomType);
    }

    const sprite = cloud.getComponent(Sprite);

    const layer = Math.floor(Math.random() * 3);
    let speed: number;
    let scale: number;
    let opacity: number;

    if (layer === 0) {
      speed = randomRange(10, 25);
      scale = randomRange(0.4, 0.6);
      opacity = 180;
    } else if (layer === 1) {
      speed = randomRange(25, 45);
      scale = randomRange(0.6, 0.9);
      opacity = 220;
    } else {
      speed = randomRange(45, 70);
      scale = randomRange(0.9, 1.3);
      opacity = 255;
    }

    const y = randomRange(
      -this.screenHeight / 2 + 50,
      this.screenHeight / 2 - 50
    );

    cloud.setScale(new Vec3(scale, scale, 1));
    cloud.setPosition(new Vec3(-this.screenWidth / 2 - 100, y, 0));
    sprite.color = new Color(255, 255, 255, opacity);

    cloud.active = true;
    this.activeClouds.push({ node: cloud, speed });
  }

  update(dt: number) {
    for (let i = this.activeClouds.length - 1; i >= 0; i--) {
      const cloudData = this.activeClouds[i];
      const pos = cloudData.node.position;
      cloudData.node.setPosition(pos.x + cloudData.speed * dt, pos.y, pos.z);

      if (pos.x > this.screenWidth / 2 + 100) {
        cloudData.node.active = false;
        this.cloudPool.push(cloudData.node);
        this.activeClouds.splice(i, 1);
      }
    }
  }
}
