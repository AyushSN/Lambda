class Orders {
    constructor() {
        this.order = null;
        this.des = [];
        this.pay = [];
        this.lineoe = [];
        this.shipping = [];
        this.tracking = [];
    }

    getTracking() {
        return this.tracking;
    }

    setTracking(tracking) {
        this.tracking = tracking;
    }

    getShipping() {
        return this.shipping;
    }

    setShipping(shipping) {
        this.shipping = shipping;
    }

    getOrder() {
        return this.order;
    }

    setOrder(order) {
        this.order = order;
    }

    getDes() {
        return this.des;
    }

    setDes(des) {
        this.des = des;
    }

    getPay() {
        return this.pay;
    }

    setPay(pay) {
        this.pay = pay;
    }

    getLineoe() {
        return this.lineoe;
    }

    setLineoe(lineoe) {
        this.lineoe = lineoe;
    }

    toString() {
        return `Orders [order=${this.order}\n des=${this.des}\n pay=${this.pay}\n lineoe=${this.lineoe}]`;
    }
}
module.exports = Orders;