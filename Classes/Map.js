import Level from "./Level.js"

export default class Map{
    

    constructor(imgArr){
        this.imgArr = imgArr
        this.levels = this.createLevels()
        // currentLevel
    }
    createLevels(){
        return this.imgArr.map(img => {
            return new Level(img)
        })
    }
    logLevels(){
        console.log(this.createLevels());
        
    }
}