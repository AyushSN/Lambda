class Employee {
    constructor({
        id_CustomerInternal,
        ID_Employee,
        NameFirst,
        NameLast,
        ct_NameFull,
        sts_Active,
        acs_OrdersLink_Access,
        acs_OrdersLink_Username,
        acs_OrdersLink_Password,
        acs_OrdersLink_cn_sts_Ready,
        acs_OrdersLink_ExternalSalesperson,
        timestamp_Update,
        action
    }) {
        this.id_CustomerInternal = id_CustomerInternal;
        this.ID_Employee = ID_Employee;
        this.NameFirst = NameFirst;
        this.NameLast = NameLast;
        this.ct_NameFull = ct_NameFull;
        this.sts_Active = sts_Active;
        this.acs_OrdersLink_Access = acs_OrdersLink_Access;
        this.acs_OrdersLink_Username = acs_OrdersLink_Username;
        this.acs_OrdersLink_Password = acs_OrdersLink_Password;
        this.acs_OrdersLink_cn_sts_Ready = acs_OrdersLink_cn_sts_Ready;
        this.acs_OrdersLink_ExternalSalesperson = acs_OrdersLink_ExternalSalesperson;
        this.timestamp_Update = timestamp_Update;
        this.action = action;
    }

    getId_CustomerInternal() {
        return this.id_CustomerInternal;
    }

    setId_CustomerInternal(id_CustomerInternal) {
        this.id_CustomerInternal = id_CustomerInternal;
    }

    getID_Employee() {
        return this.ID_Employee;
    }

    setID_Employee(ID_Employee) {
        this.ID_Employee = ID_Employee;
    }

    getNameFirst() {
        return this.NameFirst;
    }

    setNameFirst(NameFirst) {
        this.NameFirst = NameFirst;
    }

    getNameLast() {
        return this.NameLast;
    }

    setNameLast(NameLast) {
        this.NameLast = NameLast;
    }

    getCt_NameFull() {
        return this.ct_NameFull;
    }

    setCt_NameFull(ct_NameFull) {
        this.ct_NameFull = ct_NameFull;
    }

    getSts_Active() {
        return this.sts_Active;
    }

    setSts_Active(sts_Active) {
        this.sts_Active = sts_Active;
    }

    getAcs_OrdersLink_Access() {
        return this.acs_OrdersLink_Access;
    }

    setAcs_OrdersLink_Access(acs_OrdersLink_Access) {
        this.acs_OrdersLink_Access = acs_OrdersLink_Access;
    }

    getAcs_OrdersLink_Username() {
        return this.acs_OrdersLink_Username;
    }

    setAcs_OrdersLink_Username(acs_OrdersLink_Username) {
        this.acs_OrdersLink_Username = acs_OrdersLink_Username;
    }

    getAcs_OrdersLink_Password() {
        return this.acs_OrdersLink_Password;
    }

    setAcs_OrdersLink_Password(acs_OrdersLink_Password) {
        this.acs_OrdersLink_Password = acs_OrdersLink_Password;
    }

    getAcs_OrdersLink_cn_sts_Ready() {
        return this.acs_OrdersLink_cn_sts_Ready;
    }

    setAcs_OrdersLink_cn_sts_Ready(acs_OrdersLink_cn_sts_Ready) {
        this.acs_OrdersLink_cn_sts_Ready = acs_OrdersLink_cn_sts_Ready;
    }

    getAcs_OrdersLink_ExternalSalesperson() {
        return this.acs_OrdersLink_ExternalSalesperson;
    }

    setAcs_OrdersLink_ExternalSalesperson(acs_OrdersLink_ExternalSalesperson) {
        this.acs_OrdersLink_ExternalSalesperson = acs_OrdersLink_ExternalSalesperson;
    }

    getTimestamp_Update() {
        return this.timestamp_Update;
    }

    setTimestamp_Update(timestamp_Update) {
        this.timestamp_Update = timestamp_Update;
    }

    getAction() {
        return this.action;
    }

    setAction(action) {
        this.action = action;
    }
}

module.exports = Employee;
