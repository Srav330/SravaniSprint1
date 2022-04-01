export class Product {
    constructor(data) {
        if (data) {
            this.name = data.name.toLowerCase().trim();
            this.price = typeof data.price == 'number' ? data.price : Number(data.price);
            this.summary = data.summary.trim();
            this.imageName = data.imageName;
            this.imageURL = data.imageURL;
            this.qty = Number.isInteger(data.qty) ? data.qty : null;
            this.pid=data.pid;
            this.isReviewed=data.isReviewed
        }
    }

    clone(){
        const copyData = this.serialize();
        const p = new Product(copyData);
        p.set_docId(this.docId);
        return p;
    }

    set_docId(id) {
        this.docId = id;
    }
    
    //toFirestore data, format, etc
    serialize() {
        return {
            name: this.name,
            price: this.price,
            summary: this.summary,
            imageName: this.imageName,
            imageURL: this.imageURL,
            qty: this.qty,
            pid:this.pid,
            isReviewed:this.isReviewed
        }
    }

    toFireStore() {
        return {
            name: this.name,
            price: this.price,
            summary: this.summary,
            imageName: this.imageName,
            imageURL: this.imageURL,
            qty: this.qty,
        }
    }

    toFirestoreForUpdate() {
        const p = {};
        if (this.name) p.name = this.name;
        if (this.price) p.price = this.price;
        if (this.summary) p.summary = this.summary;
        if (this.imageName) p.imageName = this.imageName;
        if (this.imageURL) p.imageURL = this.imageURL;
        return p;
    }
}