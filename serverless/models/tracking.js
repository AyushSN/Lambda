class Tracking {
    constructor(x) {
        this.address1 = x.address1;
        this.address2 = x.address2;
        this.addressCity = x.addressCity;
        this.addressCompany = x.addressCompany;
        this.addressCountry = x.addressCountry;
        this.addressState = x.addressState;
        this.addressZip = x.addressZip;
        this.ID_PackImport = x.ID_PackImport;
        this.TrackingNumber = x.TrackingNumber;
        this.id_Order = x.id_Order;
        this.action = x.action;
        this.date_Creation = x.date_Creation;
        this.date_Imported = x.date_Imported;
        this.Weight = x.Weight;
        this.Cost = x.Cost;
        this.Type = x.Type;
    }

    getId_CustomerInternal() {
        return this.id_CustomerInternal;
    }

    setId_CustomerInternal(id_CustomerInternal) {
        this.id_CustomerInternal = id_CustomerInternal;
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

    getID_PackImport() {
        return this.ID_PackImport;
    }

    setID_PackImport(ID_PackImport) {
        this.ID_PackImport = ID_PackImport;
    }

    getTrackingNumber() {
        return this.TrackingNumber;
    }

    setTrackingNumber(TrackingNumber) {
        this.TrackingNumber = TrackingNumber;
    }

    getId_Order() {
        return this.id_Order;
    }

    setId_Order(id_Order) {
        this.id_Order = id_Order;
    }

    getDate_Creation() {
        return this.date_Creation;
    }

    setDate_Creation(date_Creation) {
        this.date_Creation = date_Creation;
    }

    getDate_Imported() {
        return this.date_Imported;
    }

    setDate_Imported(date_Imported) {
        this.date_Imported = date_Imported;
    }

    getWeight() {
        return this.Weight;
    }

    setWeight(Weight) {
        this.Weight = Weight;
    }

    getCost() {
        return this.Cost;
    }

    setCost(Cost) {
        this.Cost = Cost;
    }

    getType() {
        return this.Type;
    }

    setType(Type) {
        this.Type = Type;
    }

    toString() {
        return `Tracking [Address1=${this.Address1}\n Address2=${this.Address2}\n AddressCity=${this.AddressCity}\n AddressCompany=${this.AddressCompany}\n AddressCountry=${this.AddressCountry}\n AddressState=${this.AddressState}\n AddressZip=${this.AddressZip}\n ID_PackImport=${this.ID_PackImport}\n TrackingNumber=${this.TrackingNumber}\n id_Order=${this.id_Order}\n action=${this.action}\n id_CustomerInternal=${this.id_CustomerInternal}\n date_Creation=${this.date_Creation}\n date_Imported=${this.date_Imported}\n Weight=${this.Weight}\n Cost=${this.Cost}\n Type=${this.Type}]`;
    }
}

module.exports = Tracking;