class SyncSetupCustResponse {
    constructor(id, sts_purge) {
        this.id = id;
        this.sts_purge = sts_purge;
    }

    getId() {
        return this.id;
    }

    getStsPurge() {
        return this.sts_purge;
    }
}

module.exports = SyncSetupCustResponse;
