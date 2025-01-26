class Designs {
    constructor(x) {
        this.ID_Serial = x.ID_Serial;
        this.StitchesTotal = x.StitchesTotal;
        this.DesignName = x.DesignName;
        this.id_Design = x.id_Design;
        this.action = x.action;
        this.id_DesignFormat = x.id_DesignFormat;
        this.id_DesignType = x.id_DesignType;
        this.ID_OrderDesLoc = x.ID_OrderDesLoc;
        this.id_Order = x.id_Order;
        this.Location = x.Location;
        this.ColorsTotal = x.ColorsTotal;
        this.id_CustomerInternal = x.id_CustomerInternal;
    }

    getId_CustomerInternal() {
        return this.id_CustomerInternal;
    }

    setId_CustomerInternal(id_CustomerInternal) {
        this.id_CustomerInternal = id_CustomerInternal;
    }

    getID_Serial() {
        return this.ID_Serial;
    }

    setID_Serial(ID_Serial) {
        this.ID_Serial = ID_Serial;
    }

    getStitchesTotal() {
        return this.StitchesTotal;
    }

    setStitchesTotal(StitchesTotal) {
        this.StitchesTotal = StitchesTotal;
    }

    getDesignName() {
        return this.DesignName;
    }

    setDesignName(DesignName) {
        this.DesignName = DesignName;
    }

    getId_Design() {
        return this.id_Design;
    }

    setId_Design(id_Design) {
        this.id_Design = id_Design;
    }

    getAction() {
        return this.action;
    }

    setAction(action) {
        this.action = action;
    }

    getId_DesignFormat() {
        return this.id_DesignFormat;
    }

    setId_DesignFormat(id_DesignFormat) {
        this.id_DesignFormat = id_DesignFormat;
    }

    getId_DesignType() {
        return this.id_DesignType;
    }

    setId_DesignType(id_DesignType) {
        this.id_DesignType = id_DesignType;
    }

    getID_OrderDesLoc() {
        return this.ID_OrderDesLoc;
    }

    setID_OrderDesLoc(ID_OrderDesLoc) {
        this.ID_OrderDesLoc = ID_OrderDesLoc;
    }

    getId_Order() {
        return this.id_Order;
    }

    setId_Order(id_Order) {
        this.id_Order = id_Order;
    }

    getLocation() {
        return this.Location;
    }

    setLocation(Location) {
        this.Location = Location;
    }

    getColorsTotal() {
        return this.ColorsTotal;
    }

    setColorsTotal(ColorsTotal) {
        this.ColorsTotal = ColorsTotal;
    }

    toString() {
        return `Description [ID_Serial=${this.ID_Serial}\n StitchesTotal=${this.StitchesTotal}\n DesignName=${this.DesignName}\n id_Design=${this.id_Design}\n action=${this.action}\n id_DesignFormat=${this.id_DesignFormat}\n id_DesignType=${this.id_DesignType}\n ID_OrderDesLoc=${this.ID_OrderDesLoc}\n id_Order=${this.id_Order}\n Location=${this.Location}\n ColorsTotal=${this.ColorsTotal}]`;
    }
}

module.exports = Designs;