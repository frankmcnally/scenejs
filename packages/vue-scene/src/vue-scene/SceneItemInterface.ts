import { Prop, Vue, Component } from 'vue-property-decorator';
import Scene, {
  SceneItem, OPTIONS, EVENTS, EasingType, FillModeType,
  DirectionType, IterationCountType, AnimatorState,
} from 'scenejs';

@Component
export class SceneItemInterface extends Vue {
  @Prop() public from!: { [key: string]: any };
  @Prop() public to!: { [key: string]: any };
  @Prop() public keyframes!: { [key: string]: any };
  @Prop({ default: false }) public css!: boolean;
  @Prop({ default: false }) public autoplay!: boolean;
  @Prop({ default: -1 }) public time!: string | number;
  @Prop({ default: 0 }) public easing!: EasingType;
  @Prop({ default: 'forwards' }) public fillMode!: FillModeType;
  @Prop({ default: 'normal' }) public direction!: DirectionType;
  @Prop({ default: 1 }) public iterationCount!: IterationCountType;
  @Prop({ default: 0 }) public delay!: number;
  @Prop({ default: 0 }) public duration!: number;
  @Prop({ default: 1 }) public playSpeed!: number;
  protected item!: Scene | SceneItem;

  public setTime(time: number | string) {
    this.item.setTime(time);
  }
  public getTime() {
    return this.item.getTime();
  }
  public play() {
    this.css !== false ? this.item.playCSS() : this.item.play();
  }
  public pause() {
    this.item.pause();
  }
  public getItem() {
    return this.item;
  }
  public getDuration() {
    return this.item.getDuration();
  }
  protected init() {
    const item = this.item;
    const sceneOptions: Partial<AnimatorState> = {};

    OPTIONS.forEach((name) => {
      sceneOptions[name] = this.$props[name];
    });

    // console.log(this.item, this.$props, sceneOptions);
    (item as any).setOptions(sceneOptions);
    EVENTS.forEach((name) => {
      item.on(name, (e) => {
        this.$emit(name, e);
      });
    });
    if (this.autoplay !== false) {
      this.play();
    } else if (this.time !== -1) {
      this.setTime(this.time);
    }
  }
  protected updated() {
    if (this.time !== -1 && (this.autoplay === false || this.item.getPlayState() === 'paused')) {
        this.item.setTime(this.time);
    }
  }
  protected beforeDestroy() {
    this.item.off();
  }
}
