class CustomError extends Error {
    constructor(statusCode, message){
        super(message);
        this.statusCode = statusCode;
        this.message = message;
    }

    getStatusCode(){
        return this.statusCode;
    }

    getMessage(){
        return this.message;
    }
}

 module.exports = CustomError;