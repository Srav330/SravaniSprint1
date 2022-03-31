export class Review{
    constructor(data){
        if (data){
            this.pid=data.pid;
            this.feedback=data.feedback;
            this.userId=data.userId;
            this.star=data.star;
            this.email=data.email
        }
    }

    serialize() {
        return {
            pid:this.pid,
            feedback:this.feedback,
            userId:this.userId,
            star:this.star,
            email:this.email
        }
    }
}