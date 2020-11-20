const GameUtils = new class{
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
}


export {GameUtils};