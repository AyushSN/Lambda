class DesignType {
    constructor(id_CustomerInternal, ID_DesignType, DesignType, timestamp_Update, action) {
        this.id_CustomerInternal = id_CustomerInternal;
        this.ID_DesignType = ID_DesignType;
        this.DesignType = DesignType;
        this.timestamp_Update = timestamp_Update;
        this.action = action;
    }

    getId_CustomerInternal() {
        return this.id_CustomerInternal;
    }

    setId_CustomerInternal(id_CustomerInternal) {
        this.id_CustomerInternal = id_CustomerInternal;
    }

    getID_DesignType() {
        return this.ID_DesignType;
    }

    setID_DesignType(ID_DesignType) {
        this.ID_DesignType = ID_DesignType;
    }

    getDesignType() {
        return this.DesignType;
    }

    setDesignType(DesignType) {
        this.DesignType = DesignType;
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
