// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
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
        _fadeSprite: {
            default: null,
            type: cc.Node,
            tooltip: '渐变对像，从star到end的透明度变化',
        },
        isPlayAni: {
            default: true,
            tooltip: "是否播放打开关闭动画",
        },
        isMaskClose: {
            default: true,
            tooltip: "是否点击遮罩关闭",
        },
        animType: {
            default: 0,
            type: cc.Integer,
            tooltip: '0:中间绽放，1:左出，2:右出, 3:从上到下',
        },
        /**
         * !#zh 点击背影遮罩自动关闭时调用的事件。
         * @property {Component.EventHandler[]} clickEvents
         */
        clickMaskHideEvents: {
            default: [],
            type: cc.Component.EventHandler,
            tooltip: '点击背影遮罩自动关闭时调用的事件',
        },
        fadeOpacity: 150,
        isCanClickMaskHide: true,
    },

    ctor() {
        this.originalX = 0;
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.originalX = this.node.x;

    },

    start() {
        // this.show();
    },

    onEnable() {

    },

    onDisable() {
    },

    onDestroy() {
        if (this._fadeSprite)
            this._fadeSprite.off(cc.Node.EventType.TOUCH_END, this._onTouchEndedByMask, this);
    },

    // init: function (home, panelType) {
    //     this.home = home;
    //     this.node.active = false;
    //     this.anim.play('shop_reset');
    //     this.panelType = panelType;
    //     this.figure.node.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(1, 1, 0.96), cc.scaleTo(1, 1, 1))));
    //     this.chargeUI.init(home, this.btnsNode);
    // },
    show: function (p_animType = -1) {
        if( this.node.active )return;
        console.log("basealert show:", this.node.name);
        p_animType > -1 && (this.animType = p_animType);
        // var node = cc.instantiate(cc.url.raw("resources/alertMaskBG.prefab"));
        // node.opacity = 255;
        // this.node.addChild(node,0);
        var self = this;
        !cc.isValid(this.originalX) && (this.originalX = this.node.x);
        !cc.isValid(this.originalY) && (this.originalY = this.node.y);
        this.node.stopAllActions();
        this.node.active = true;
        if (this.isPlayAni) {
            switch (this.animType) {
                case 0:
                    this.node.scale = 0.3;
                    this.node.runAction(cc.sequence(cc.scaleTo(0.1, 1.2), cc.scaleTo(0.1, 1)));
                    break;
                case 1:
                    this.node.x = this.originalX - this.node.width;
                    this.node.runAction(cc.sequence(cc.delayTime(0.1), cc.moveTo(0.2, cc.v2(this.originalX, this.originalY))));
                    break;
                case 2:
                    this.node.x = this.originalX + this.node.width;
                    this.node.runAction(cc.sequence(cc.delayTime(0.1), cc.moveTo(0.2, cc.v2(this.originalX, this.originalY))));
                    break;
                case 3:
                    this.node.y = (CanvasHeight() - this.node.height) / 2 + this.node.height;
                    this.node.runAction(cc.sequence(cc.delayTime(0.1), cc.moveTo(0.2, cc.v2(this.originalX, this.originalY))));
                    break;
            }
        } else {
            this.node.scale = 1;
        }
        if (this._fadeSprite) {
            this.playFadeAni();
        } else {
            cc.loader.loadRes("prefab/maskBg", cc.Prefab, function (err, atlas) {
                self._loadedFadeToOpacity(atlas);
            });
        }

    },

    _loadedFadeToOpacity(atlas) {
        this._fadeSprite = cc.instantiate(atlas);

        switch (this.animType) {
            case 0:
                this._fadeSprite.width = CanvasWidth();
                this._fadeSprite.height = CanvasHeight();
                break;
            case 1:
                this._fadeSprite.x = 0 - CanvasWidth() / 2 - this.originalX;
                this._fadeSprite.y = 0 - this.node.y;
                this._fadeSprite.anchorX = 0;
                this._fadeSprite.anchorY = 0.5;
                this._fadeSprite.width = CanvasWidth() + this.node.width;
                this._fadeSprite.height = CanvasHeight();
                break;
            case 2:
                this._fadeSprite.x = CanvasWidth() / 2 - this.originalX;
                this._fadeSprite.y = 0 - this.node.y;
                this._fadeSprite.anchorX = 1;
                this._fadeSprite.anchorY = 0.5;
                this._fadeSprite.width = CanvasWidth() + this.node.width;
                this._fadeSprite.height = CanvasHeight();
                break;
            case 3:
                this._fadeSprite.width = CanvasWidth();
                this._fadeSprite.height = CanvasHeight() + CanvasHeight() * 2;
                break;
        }
        if (this.isMaskClose) {
            this._fadeSprite.on(cc.Node.EventType.TOUCH_END, this._onTouchEndedByMask, this);
        }
        this.playFadeAni();
        this.node.addChild(this._fadeSprite, -2);
    },

    playFadeAni() {
        if (this.isPlayAni) {
            this._fadeSprite.runAction(cc.fadeTo(0.5, this.fadeOpacity));
            this._fadeSprite.opacity = 0;
        } else {
            this._fadeSprite.opacity = this.fadeOpacity;
        }
    },

    hide: function () {
        this.node.stopAllActions();
        if (this._fadeSprite) {
            this._fadeSprite.opacity = 0;
        }
        if (this.isPlayAni) {
            switch (this.animType) {
                case 0:
                    this.node.runAction(cc.sequence(cc.scaleTo(0.1, 1.1), cc.scaleTo(0.1, 0.5), cc.callFunc(function (target) {
                        target.active = false;
                    })));
                    break;
                case 1:
                    this.node.runAction(cc.sequence(cc.moveTo(0.2, cc.v2(this.originalX - this.node.width, this.originalY)), cc.callFunc(function (target) {
                        target.active = false;
                    })));
                    break;
                case 2:
                    this.node.runAction(cc.sequence(cc.moveTo(0.2, cc.v2(this.originalX + this.node.width, this.originalY)), cc.callFunc(function (target) {
                        target.active = false;
                    })));
                    break;
                case 3:
                    var toY = this.originalY - (CanvasHeight() - this.node.height) / 2 - this.node.height;
                    this.node.runAction(cc.sequence(cc.moveTo(0.2, cc.v2(this.originalX, toY)), cc.callFunc(function (target) {
                        target.active = false;
                    })));
                    break;
            }

        } else {
            this.node.active = false;
        }
    },

    _onFinishShow: function () {
        this.node.active = true;
    },

    _onFinishHide: function () {
        this.node.active = false;
    },

    _onTouchEndedByMask(event) {
        cc.Component.EventHandler.emitEvents(this.clickMaskHideEvents, event);
        this.node.emit('click', this);
        if (this.isCanClickMaskHide)
            this.hide();
        event.stopPropagation();
    },

    // update (dt) {},
});