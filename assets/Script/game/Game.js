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
        victoryPanel:cc.Node,
        failedPanel:cc.Node,

        cardPanel: cc.Node,

        cardNode: cc.Node,

        timeCountDownProgress: cc.ProgressBar,
        timeCountDownProgressThumb: cc.Node,
        timeCountDownLabel: cc.Label,

    },

    ctor() {
        this.curTime = 0;
        this.maxTime = 0;

        this.cards = [];
        this.curResidueCardValues = [];
        this.score = 0;
        this.selectCard1 = null;
        this.selectCard2 = null;
        this.isCanFlip = true;
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.initGame();
    },

    onDestroy() {
        this.unscheduleAllCallbacks();
    },

    initGame() {
        var length = cc.gg.gameData.length * 2;
        this.curResidueCardValues = [];
        var cardValues = [];
        for (let i = 0; i < cc.gg.gameData.length; i++) {
            this.curResidueCardValues.push(i+1);
            cardValues.push(i+1);
            cardValues.push(i+1);
        }
        var gap = 10;
        var row = Math.floor(cc.gg.gameData.length/2);
        if( row > 3 ) row = 3;
        var column = Math.ceil(cc.gg.gameData.length * 2 /row);
        var cardX = 0 - ((this.cardNode.width + gap) * column - gap)/2 ;
        var cardY = ((this.cardNode.height + gap) * row - gap)/2;
        this.cardPanel.x 
        for (let index = 0; index < length; index++) {
            var cardValue = cardValues[0];
            if( cardValues.length > 1 ){
                var plance = Math.floor(Math.random() * cardValues.length);
                cardValue = cardValues.splice(plance,1)[0];
            }
            if( this.cards.length > index ){
                var cardJS = this.cards[index];
                var card = cardJS.node;
            }else{
                var card = cc.instantiate(this.cardNode);
                var cardJS = card.getComponent("GameCard");
                this.cards.push(cardJS);
                this.cardPanel.addChild(card);
            }
            card.y = cardY - Math.floor(index/column) * (card.height + gap) - card.height/2;
            card.x = cardX + index % column * (card.width + gap) + card.width/2;
            cardJS.setData({"type":cc.gg.gameData.type, "value":cardValue});
            if( !cardValue ) {
                console.log("error");
            }
            console.log( "cardValue=", cardValue);
        }
        this.setCountDownTime(120);
    },

    btnTest0(){

    },

    btnReturnLobby() {

    },
    //重新开始
    refresh() {
        this.selectCard1 = null;
        this.selectCard2 = null;
        this.victoryPanel.active = false;
        this.failedPanel.active = false;
        this.initGame();
    },
    //返回大厅
    btnReturnLobby() {
        this.switchScene("gameTypes");
    },
    //卡牌点击事件
    btnCardClickHandler(event) {
        var gameCard = event.target.getComponent("GameCard");
        if( !gameCard.enabled )return;
        if (this.isCanFlip) {
            this.setSelectedCard(gameCard);
        }
    },
    //设置当前选中的牌
    setSelectedCard(value) {
        if (this.selectCard1) {
            this.isCanFlip = false;
            this.selectCard2 = value;
            value.flip(this.cardFlipComplete.bind(this));
        } else {
            this.selectCard1 = value;
            value.flip();
        }
    },
    //牌翻转过后的完成事件
    cardFlipComplete() {
        if (!this.selectCard1 || !this.selectCard2){
            this.isCanFlip = true;
            return;
        } 
        this.scheduleOnce(() => {
            this.isCanFlip = true;
            if (this.selectCard1.value == this.selectCard2.value) {
                this.selectCard1.hide();
                this.selectCard2.hide(this.cardHideComplete.bind(this));
                var index = this.curResidueCardValues.indexOf(this.selectCard1.value);
                this.curResidueCardValues.splice(index, 1);
            } else {
                this.selectCard1.flip(null, 1);
                this.selectCard2.flip(null, 1);
            }
            this.selectCard1 = null;
            this.selectCard2 = null;
        }, 0.5);
    },

    cardHideComplete(){
        if (this.curResidueCardValues.length == 0) {
            this.gameComplete();
        }
    },

    gameComplete() {
        this.victoryPanel.active = true;
        this.stopTickTime();
    },

    gameFild() {
        this.failedPanel.active = true;
    },

    setCountDownTime(time) {
        if( time <= 0 ){
            this.stopTickTime();
            return;
        }
        this.countDownTime = time;
        this.startTickTime(0,this.countDownTime);
        this.timeCountDownLabel.string = time;
        this.timeCountDownProgressThumb.color = cc.Color.WHITE;
    },

    startTickTime: function (startValue, endValue) {
        this._tickCount = (1 - startValue / endValue);
        this.schedule(this.setMaskTimeValue, endValue / 100);
        this.startTime = Date.now();
        this.endTime = endValue * 1000;
        this.count = 0;
        cc.log(this.startTime, "开始计时:", endValue / 100, this._tickCount);
        this.setMaskTimeValue();
    },

    stopTickTime: function () {
        this.unschedule(this.setMaskTimeValue);
    },

    setMaskTimeValue: function () {
        this.count++;
        var date = Date.now();
        var curTime = date - this.startTime;
        this._tickCount = 1 - curTime / this.endTime;
        var timeSecond = Math.floor((this.endTime - curTime) / 1000);
        timeSecond = timeSecond < 0 ? 0 : timeSecond;
        this.timeCountDownLabel.string = timeSecond;
        // cc.log(date, "计时:", this._tickCount, curTime, curTime / this.endTime);
        this.timeCountDownProgress.progress = this._tickCount;
        if (this._tickCount <= 0) {
            this.stopTickTime();
            this.gameFild();
            // cc.log(Date.now(), "结束计时:", this.count);
        } else if (this._tickCount < 0.33) {
            this.timeCountDownProgressThumb.color = cc.Color.RED;
        } else if (this._tickCount < 0.66) {
            this.timeCountDownProgressThumb.color = cc.Color.YELLOW;
        } else {
            this.timeCountDownProgressThumb.color = cc.Color.GREEN;
        }
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
