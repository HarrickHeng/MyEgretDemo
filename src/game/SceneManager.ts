class SceneManager extends eui.Component {
	public rootLayer: eui.UILayer;//起始场景
	public currentScene: Scene;//需要显示的场景
	private pop_scene: eui.Component;//弹出场景层

	private static _manager: SceneManager;
	public static get Instance() {
		SceneManager._manager = SceneManager._manager ? SceneManager._manager : new SceneManager();
		return SceneManager._manager;
	}

	public constructor() {
		super();
	}

	//切换场景
	public changeScene(s: Scene) {
		if (this.currentScene) {
			this.rootLayer.removeChild(this.currentScene);
			this.currentScene = null;
		}
		this.popScene();
		this.rootLayer.addChild(s);
		this.currentScene = s;
	}
	//弹出场景层
	public pushScene(s: Scene) {
		this.popScene();
		if (!this.pop_scene) {
			this.rootLayer.addChild(s);
			this.pop_scene = s;
		}
	}
	//关闭场景层
	public popScene() {
		if (this.pop_scene) {
			this.rootLayer.removeChild(this.pop_scene);
			this.pop_scene = null;
		}
	}
}