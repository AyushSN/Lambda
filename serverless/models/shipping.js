class Shipping {
    constructor(x) {
        this.Address1 = x.Address1;
        this.Address2 = x.Address2;
        this.AddressCity = x.AddressCity;
        this.AddressCompany = x.AddressCompany;
        this.AddressCountry = x.AddressCountry;
        this.AddressState = x.AddressState;
        this.AddressZip = x.AddressZip;
        this.ID_Address = x.ID_Address;
        this.id_OrderKeyAlpha = x.id_OrderKeyAlpha;
        this.ShipMethod = x.ShipMethod;
        this.action = x.action;
        this.id_Order = x.id_Order;
        this.id_CustomerInternal = x.id_CustomerInternal;
    }

    getId_CustomerInternal() {
        return this.id_CustomerInternal;
    }

    setId_CustomerInternal(id_CustomerInternal) {
        this.id_CustomerInternal = id_CustomerInternal;
    }

    getId_Order() {
        return this.id_Order;
    }

    setId_Order(id_Order) {
        this.id_Order = id_Order;
    }

    getAction() {
        return this.action;
    }

    setAction(action) {
        this.action = action;
    }

    getAddress1() {
        return this.Address1;
    }

    setAddress1(Address1) {
        this.Address1 = Address1;
    }

    getAddress2() {
        return this.Address2;
    }

    setAddress2(Address2) {
        this.Address2 = Address2;
    }

    getAddressCity() {
        return this.AddressCity;
    }

    setAddressCity(AddressCity) {
        this.AddressCity = AddressCity;
    }

    getAddressCompany() {
        return this.AddressCompany;
    }

    setAddressCompany(AddressCompany) {
        this.AddressCompany = AddressCompany;
    }

    getAddressCountry() {
        return this.AddressCountry;
    }

    setAddressCountry(AddressCountry) {
        this.AddressCountry = AddressCountry;
    }

    getAddressState() {
        return this.AddressState;
    }

    setAddressState(AddressState) {
        this.AddressState = AddressState;
    }

    getAddressZip() {
        return this.AddressZip;
    }

    setAddressZip(AddressZip) {
        this.AddressZip = AddressZip;
    }

    getID_Address() {
        return this.ID_Address;
    }

    setID_Address(ID_Address) {
        this.ID_Address = ID_Address;
    }

    getId_OrderKeyAlpha() {
        return this.id_OrderKeyAlpha;
    }

    setId_OrderKeyAlpha(id_OrderKeyAlpha) {
        this.id_OrderKeyAlpha = id_OrderKeyAlpha;
    }

    getShipMethod() {
        return this.ShipMethod;
    }

    setShipMethod(ShipMethod) {
        this.ShipMethod = ShipMethod;
    }

    toString() {
        return `Shipping [Address1=${this.Address1}\n Address2=${this.Address2}\n AddressCity=${this.AddressCity}\n AddressCompany=${this.AddressCompany}\n AddressCountry=${this.AddressCountry}\n AddressState=${this.AddressState}\n AddressZip=${this.AddressZip}\n ID_Address=${this.ID_Address}\n id_OrderKeyAlpha=${this.id_OrderKeyAlpha}\n ShipMethod=${this.ShipMethod}]`;
    }
}

module.exports = Shipping;