cc.gg = cc.gg || {};
cc.gg.name = 'MemoryDog';
//是否Debug
cc.gg.isDebug = CC_DEBUG;
cc.gg.isDebug = false;
//事件体
cc.gg.evt = cc.gg.evt || new cc.EventTarget();

cc.gg.onlyBtnName = "";
cc.gg.version = '1.1.1';
if(cc.gg.spreadId == undefined){
    cc.gg.spreadId = 1;
}
cc.gg.imsi = Math.random().toString();
// cc.gg.imsi = '5d7b0208cefd589e0acb56ec2115d29d';
cc.gg.xxteaKey = "87d2676474c5d267";
cc.gg.sceneName = '';

cc.gg.DesignWidth = 720;
cc.gg.DesignHeight = 1280;

cc.gg.gameData = {"type":1, "length":6};

cc.gg.gameConfig = [
    ,5,5
]


let baseUrl = 'http://172.16.10.103';
// let baseUrl = 'http://172.16.11.252';
if (!cc.gg.isDebug) {
    baseUrl = 'http://ec2-15-206-188-191.ap-south-1.compute.amazonaws.com';
    cc.gg.h5Sub = baseUrl+"/#/";
} else {
    cc.gg.h5Sub = "http://172.16.10.105/#/";
}
cc.gg.Api = baseUrl+':18080/';
cc.gg.download = cc.gg.Api+'image/download';

cc.gg.setup = {
    sfxVolume: 1.0, //音效音量
    vibration: true,    //震动提醒
    sound: true,  //音效开关
    colorDeck4: false,  //游戏中4色牌开关
    i18n:'en',
}

cc.gg.user = {
    UserID: 0,
    NickName: "USER_235",
    FaceUrl: "d3ae0c53-3578-45e6-a21e-420786bbf873",
    Phone: "",
    Score: 0, //总金额
}

cc.gg.setUser = function (msg) {
    // let msg = new proto.message.LoginResp();
    let user = cc.gg.user;
    user.UserID = msg.getUserid();
    user.NickName = msg.getNickname();
    if(user.NickName == ""){
        user.NickName = "USER_" + user.UserID;
    }
    user.FaceUrl = msg.getFaceurl();
    user.Phone = msg.getPhone();
    user.Score = msg.getScore();
    user.BindScore = msg.getBindscore();
    user.UniqueID = msg.getUniqueid();
    user.GateInfo = msg.getGateinfo();
    user.RealStatus = msg.getRealstatus();
    cc.gg.setToken(msg.getToken())
}

cc.gg.setToken = function (token) {
    let user = cc.gg.user;
    user.Token = token;
    // user.Token = "123";
    user.TokenTime = Date.now() + 86400000;
    cc.gg.saveUserData();
}

cc.gg.saveUserData = function () {
    cc.sys.localStorage.setItem("user", JSON.stringify(cc.gg.user));
}
cc.gg.saveSetupData = function () {
    cc.sys.localStorage.setItem("setup",JSON.stringify(cc.gg.setup));
}

cc.gg.withdrawScore = function () {
    return cc.gg.user.Score - cc.gg.user.BindScore;
}

cc.GGEventType = {
    //ws链接成功
    CONNECT_SUCC: 'connect_succ',
    //ws链接失败
    CONNECT_FAIL: 'connect_fail',
    //ws链接关闭
    CONNECT_CLOSE: 'connect_close',

    I18N_UPDATE: 'i18nUpdate',
    ROOM_UPDATE: 'roomUpdate',
    NICK_UPDATE: 'nickUpdate',
    HEAD_UPDATE: 'headUpdate',
    GOLD_UPDATE: 'goldUpdate',
    Game: {
        RECONNECT_CLEAR_GAME: "game.reconnect",//重新连接游戏后，删除掉已不存在的房间
        JOIN_ROOM: "game.join_room",
        DESK_INFO: "game.desk_info",
        GAME_START_WAIT: "game.start_waitTime",
        UPDATE_SCORE: "game.update_score",

        UPDATE_ROOMNAME: "game.update_roomName",
        TIPS_TO_DECLARE: "game.TipsToDeclare",
    },
    Guide:{
        GROUP_CARD:'GroupCard',
        SELECT_CARD:'SelectCard',
        FINISH_CARD:'FinishCard',
    },
    Animation: {
        ACTING_CARD: "rm.acting_card",
        TOUCH_CARD_END: "rm.touch_card_end",
        SWAP_CARD_GROUP: "rm.swap_card_group",
        ADD_TO_CARD_GROUP: "rm.addto_card_group"
    },
    System: {
        SWITCH_CARD_COLOR: "sm.switch_card_color"
    },
    Email: {
        READ_RET: "email.read.ret",
    },
}
