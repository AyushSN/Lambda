class Customer {
    constructor(cust) {
        this.id_CustomerInternal = cust.id_CustomerInternal;
        this.ID_Customer = cust.ID_Customer;
        this.CompanyName = cust.CompanyName;
        this.OrdersLinkUsername = cust.OrdersLinkUsername;
        this.OrdersLinkPassword = cust.OrdersLinkPassword;
        this.sts_OrdersLinkAccess = cust.sts_OrdersLinkAccess;
        this.sts_OrdersLinkReady = cust.sts_OrdersLinkReady;
        this.AddressDescription = cust.AddressDescription;
        this.AddressCompany = cust.AddressCompany;
        this.Address1 = cust.Address1;
        this.Address2 = cust.Address2;
        this.AddressCity = cust.AddressCity;
        this.AddressState = cust.AddressState;
        this.AddressZip = cust.AddressZip;
        this.AddressCountry = cust.AddressCountry;
        this.timestamp_Update = cust.timestamp_Update;
        this.action = cust.action;
    }
    getAction() {
        return this.action;
    }
    setAction(action) {
        this.action = action;
    }
    getTimestamp_Update() {
        return this.timestamp_Update;
    }
    setTimestamp_Update(timestamp_Update) {
        this.timestamp_Update = timestamp_Update;
    }
    getId_CustomerInternal() {
        return this.id_CustomerInternal;
    }
    setId_CustomerInternal(id_CustomerInternal) {
        this.id_CustomerInternal = id_CustomerInternal;
    }
    getID_Customer() {
        return this.ID_Customer;
    }
    setID_Customer(ID_Customer) {
        this.ID_Customer = ID_Customer;
    }
    getCompanyName() {
        return this.CompanyName;
    }
    setCompanyName(companyName) {
        this.CompanyName = companyName;
    }
    getOrdersLinkUsername() {
        return this.OrdersLinkUsername;
    }
    setOrdersLinkUsername(ordersLinkUsername) {
        this.OrdersLinkUsername = ordersLinkUsername;
    }
    getOrdersLinkPassword() {
        return this.OrdersLinkPassword;
    }
    setOrdersLinkPassword(ordersLinkPassword) {
        this.OrdersLinkPassword = ordersLinkPassword;
    }
    getSts_OrdersLinkAccess() {
        return this.sts_OrdersLinkAccess;
    }
    setSts_OrdersLinkAccess(sts_OrdersLinkAccess) {
        this.sts_OrdersLinkAccess = sts_OrdersLinkAccess;
    }
    getSts_OrdersLinkReady() {
        return this.sts_OrdersLinkReady;
    }
    setSts_OrdersLinkReady(sts_OrdersLinkReady) {
        this.sts_OrdersLinkReady = sts_OrdersLinkReady;
    }
    getAddressDescription() {
        return this.AddressDescription;
    }   
    setAddressDescription(addressDescription) {
        this.AddressDescription = addressDescription;
    }
    getAddressCompany() {
        return this.AddressCompany;
    }
    setAddressCompany(addressCompany) {
        this.AddressCompany = addressCompany;
    }
    getAddress1() {
        return this.Address1;
    }
    setAddress1(address1) {
        this.Address1 = address1;
    }
    getAddress2() {
        return this.Address2;
    }
    setAddress2(address2) {
        this.Address2 = address2;
    }
    getAddressCity() {
        return this.AddressCity;
    }
    setAddressCity(addressCity) {
        this.AddressCity = addressCity;
    }
    getAddressState() {
        return this.AddressState;
    }
    setAddressState(addressState) {
        this.AddressState = addressState;
    }
    getAddressZip() {
        return this.AddressZip;
    }
    setAddressZip(addressZip) {
        this.AddressZip = addressZip;
    }
    getAddressCountry() {
        return this.AddressCountry;
    }
    setAddressCountry(addressCountry) {
        this.AddressCountry = addressCountry;
    }
}

module.exports = Customer;