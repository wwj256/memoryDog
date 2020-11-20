cc.Class({
    extends: cc.Component,

    editor: {
        // executeInEditMode: true,
        menu: '自定义/AudioMgr'
    },

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        bgmVolume: 1.0,
        sfxVolume: 1.0,

        bgmAudioID: -1,
    },

    onLoad() {
        if (cc.gg.audioMgr) {
            cc.log("cc.gg.audioMgr,重复创建，请注意这里。。。。。。。。。。。。。。。。。。")
            return;
        }
        cc.gg.audioMgr = this;
        this.sfxVolume = cc.gg.setup.sfxVolume;
        // cc.game.on(cc.game.EVENT_HIDE, this.onHideHandler, this);
        // cc.game.on(cc.game.EVENT_SHOW, this.onShowHandler, this);
        cc.log("audioMgr onLoad()");
    },

    onDestroy() {
        // cc.game.off(cc.game.EVENT_HIDE, this.onHideHandler, this);
        // cc.game.off(cc.game.EVENT_SHOW, this.onShowHandler, this);
        cc.log("audioMgr onDestroy()");
    },

    start() {
        this.init();
    },

    onHideHandler() {
        this.pauseAll();
        cc.log("cc.game.EVENT_HIDE");
    },

    onShowHandler() {
        cc.log("cc.game.EVENT_SHOW");
        this.resumeAll();
    },

    // use this for initialization
    init: function () {
        var t = cc.sys.localStorage.getItem("bgmVolume");
        if (t != null) {
            this.bgmVolume = parseFloat(t);
        }

        var t = cc.sys.localStorage.getItem("sfxVolume");
        if (t != null) {
            this.sfxVolume = parseFloat(t);
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    getUrl: function (url) {
        // return cc.url.raw("sounds/" + url);
        return "sound/" + url;
    },

    playBGM(url) {
        if (this.curBGMUrl == url) {
            return;
        }
        var audioUrl = this.getUrl(url);
        console.log("playBGM===", audioUrl, this.bgmAudioID);
        this.stopBGM();
        var self = this;
        cc.loader.loadRes(audioUrl, cc.AudioClip, function (err, clip) {
            if (err == null) {
                self.stopBGM();
                self.bgmAudioID = cc.audioEngine.play(clip, true, self.bgmVolume);
                self.curBGMUrl = url;
                console.log("playBGM curBgmAudioId=", self.bgmAudioID);
            } else {
                cc.log("加载背景音乐失败", err);
            }
        });
        // this.bgmAudioID = cc.audioEngine.play(audioUrl, true, this.bgmVolume);
    },

    stopBGM() {
        this.curBGMUrl = "";
        if (this.bgmAudioID >= 0) {
            cc.audioEngine.stop(this.bgmAudioID);
            this.bgmAudioID = 0;
        }
    },
    /**
     * 设置音效开关，
     * @param value 
     */
    setSFXSwitch(value) {
        if (value) {
            this.setSFXVolume(cc.gg.setup.sfxVolume);
        } else {
            this.setSFXVolume(0);
        }
    },

    playSFX(url) {
        var audioUrl = this.getUrl(url);
        var self = this;
        if (this.sfxVolume > 0) {
            // var audioId = cc.audioEngine.play(audioUrl, false, this.sfxVolume);
            cc.loader.loadRes(audioUrl, cc.AudioClip, function (err, clip) {
                if (err == null) {
                    cc.audioEngine.play(clip, false, self.sfxVolume);
                } else {
                    cc.log("加载音效失败", err);
                }
            });
        }
    },

    setSFXVolume: function (v) {
        if (this.sfxVolume != v) {
            cc.sys.localStorage.setItem("sfxVolume", v);
            this.sfxVolume = v;
        }
    },

    setBGMVolume: function (v, force) {
        if (this.bgmAudioID >= 0) {
            if (v > 0) {
                cc.audioEngine.resume(this.bgmAudioID);
            } else {
                cc.audioEngine.pause(this.bgmAudioID);
            }
            //cc.audioEngine.setVolume(this.bgmAudioID,this.bgmVolume);
        }
        if (this.bgmVolume != v || force) {
            cc.sys.localStorage.setItem("bgmVolume", v);
            this.bgmVolume = v;
            cc.audioEngine.setVolume(this.bgmAudioID, v);
        }
    },

    pauseAll: function () {
        cc.audioEngine.pauseAll();
    },

    resumeAll: function () {
        cc.audioEngine.resumeAll();
    }
});