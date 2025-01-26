class Payment {
    constructor(x) {
        this.id_PaymentType = x.id_PaymentType;
        this.ID_SubPayment = x.ID_SubPayment;
        this.PaymentType = x.PaymentType;
        this.action = x.action;
        this.cur_SubPayment = x.cur_SubPayment;
        this.PaymentNumber = x.PaymentNumber;
        this.date_Applied = x.date_Applied;
        this.id_Order = x.id_Order;
        this.id_CustomerInternal = x.id_CustomerInternal;
        this.ID_Subpayment = x.ID_Subpayment;
    }

    getID_Subpayment() {
        return this.ID_Subpayment;
    }

    setID_Subpayment(ID_Subpayment) {
        this.ID_Subpayment = ID_Subpayment;
    }

    getId_CustomerInternal() {
        return this.id_CustomerInternal;
    }

    setId_CustomerInternal(id_CustomerInternal) {
        this.id_CustomerInternal = id_CustomerInternal;
    }

    getId_PaymentType() {
        return this.id_PaymentType;
    }

    setId_PaymentType(id_PaymentType) {
        this.id_PaymentType = id_PaymentType;
    }

    getID_SubPayment() {
        return this.ID_SubPayment;
    }

    setID_SubPayment(ID_SubPayment) {
        this.ID_SubPayment = ID_SubPayment;
    }

    getPaymentType() {
        return this.PaymentType;
    }

    setPaymentType(PaymentType) {
        this.PaymentType = PaymentType;
    }

    getAction() {
        return this.action;
    }

    setAction(action) {
        this.action = action;
    }

    getCur_SubPayment() {
        return this.cur_SubPayment;
    }

    setCur_SubPayment(cur_SubPayment) {
        this.cur_SubPayment = cur_SubPayment;
    }

    getPaymentNumber() {
        return this.PaymentNumber;
    }

    setPaymentNumber(PaymentNumber) {
        this.PaymentNumber = PaymentNumber;
    }

    getDate_Applied() {
        return this.date_Applied;
    }

    setDate_Applied(date_Applied) {
        this.date_Applied = date_Applied;
    }

    getId_Order() {
        return this.id_Order;
    }

    setId_Order(id_Order) {
        this.id_Order = id_Order;
    }

    toString() {
        return `Payment [id_PaymentType=${this.id_PaymentType}\n ID_SubPayment=${this.ID_SubPayment}\n PaymentType=${this.PaymentType}\n action=${this.action}\n cur_SubPayment=${this.cur_SubPayment}\n PaymentNumber=${this.PaymentNumber}\n date_Applied=${this.date_Applied}\n id_Order=${this.id_Order}]`;
    }
}


module.exports = Payment;