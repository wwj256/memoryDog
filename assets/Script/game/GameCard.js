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
        _value: 0,
        value: {
            get() {
                return this._value;
            },
            set(value) {
                this._value = value;
            }
        },
        frameNode: cc.Node,
        cardSprite: cc.Sprite,
    },

    ctor() {
        this.value = 0;
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.setScale(1);
    },

    setData(value) {
        this.data = value;
        this.value = this.data.value;
        this.setCardIco("cardBG");
        this.node.active = true;
        this.node.opacity = 255;
        this.enabled = true;
    },

    setScale(value) {
        this.scale = value;
        this.node.scale = value;
    },

    flip(completeFun = null, isViewBack = false) {
        if( !isViewBack )cc.gg.audioMgr.playSFX("click");
        this.enabled = isViewBack;
        let t = cc.scaleTo(.2, -.01, 1.2 * this.scale),
            i = cc.callFunc(() => {
                var cardUrl = isViewBack ? "cardBG" : this.data.type + "/" + this.data.value;
                this.setCardIco(cardUrl);
            }),
            s = cc.scaleTo(.2, this.scale, this.scale),
            a = cc.callFunc(() => {
                completeFun && completeFun();
            }),
            r = cc.sequence(t, i, s, a);
        this.node.runAction(r);
    },
    hide(completeFun) {
        this.enabled = false;
        this.node.runAction(cc.sequence(cc.fadeOut(.5), cc.callFunc(() => {
            this.node.active = !1;
            completeFun && completeFun();
        })));
    },

    setCardIco(url){
        cc.loader.loadRes(url, cc.SpriteFrame, (err, data)=> {
            if (data)
                this.cardSprite.spriteFrame = data;
        });
    }

    // update (dt) {},
});
