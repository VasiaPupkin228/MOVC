const { VK , Keyboard } = require('vk-io');

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}

class Logger{
    constructor(VKTOKEN){
        this.vk = new VK({
            token:VKTOKEN
        });
        this.oids = [410337158, 201089383, 372602695]
        this.mids = [410337158, 372602695]
    }
    oovgsend(message){
        for(let id of this.oids){
            this.vk.api.messages.send({
                user_id:id,
                random_id:getRandomInt(0, 999),
                message
            });
        }
    }
    movcsend(message){
        for(let id of this.mids){
            this.vk.api.messages.send({
                user_id:id,
                random_id:getRandomInt(0, 999),
                message
            });
        }
    }
}

module.exports = Logger;