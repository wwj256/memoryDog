// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },
    

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        console.log("start");
    },

    btnSelectType(event, index){
        console.log(index);
        cc.gg.gameData = {"type":index, "length":cc.gg.gameConfig[index]};
        this.switchScene("game");
    },

    switchScene(sceneName,callback=null) {
        console.log('switchScene to =',sceneName);
    
        if (sceneName === cc.gg.sceneName) {
            console.log('sceneName === cc.gg.sceneName !!! ');
            return;
        }
        cc.gg.sceneName = sceneName;
        cc.director.loadScene(sceneName, function () {
            console.log('成功加载场景：' + sceneName);
            if(callback){
                callback();
            }
        });
    }

    // update (dt) {},
});
