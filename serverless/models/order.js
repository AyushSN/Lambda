class Order {
    constructor(x) {
        this.ContactFirst = x.ContactFirst;
        this.ID_Order = x.ID_Order;
        this.cn_sts_HoldOrder = x.cn_sts_HoldOrder;
        this.id_ReceivingStatus = x.id_ReceivingStatus;
        this.DesignName = x.DesignName;
        this.slot_12 = x.slot_12;
        this.sts_ArtDone = x.sts_ArtDone;
        this.slot_13 = x.slot_13;
        this.cur_Shipping = x.cur_Shipping;
        this.slot_10 = x.slot_10;
        this.slot_11 = x.slot_11;
        this.cur_Adjust = x.cur_Adjust;
        this.CustomerServiceRepFaxWork = x.CustomerServiceRepFaxWork;
        this.cnCur_SalesTaxTotal = x.cnCur_SalesTaxTotal;
        this.CompanyName = x.CompanyName;
        this.sts_Purchased = x.sts_Purchased;
        this.TermsDays = x.TermsDays;
        this.sts_Received = x.sts_Received;
        this.action = x.action;
        this.sts_ReceivedSub = x.sts_ReceivedSub;
        this.cn_TotalProductQty_Current = x.cn_TotalProductQty_Current;
        this.cur_Subtotal = x.cur_Subtotal;
        this.cn_sts_HoldOrderGraphic = x.cn_sts_HoldOrderGraphic;
        this.cnCur_Balance = x.cnCur_Balance;
        this.date_OrderInvoiced = x.date_OrderInvoiced;
        this.CustomField10 = x.CustomField10;
        this.ContactDepartment = x.ContactDepartment;
        this.CustomerServiceRepPhoneWork = x.CustomerServiceRepPhoneWork;
        this.NotesFormsInvoice = x.NotesFormsInvoice;
        this.id_CompanyLocation = x.id_CompanyLocation;
        this.CustomerType = x.CustomerType;
        this.CustomerServiceRepEmailWork = x.CustomerServiceRepEmailWork;
        this.id_SalesStatus = x.id_SalesStatus;
        this.CustomField04 = x.CustomField04;
        this.CustomField03 = x.CustomField03;
        this.CustomField06 = x.CustomField06;
        this.CustomField05 = x.CustomField05;
        this.date_OrderPlaced = x.date_OrderPlaced;
        this.CustomField02 = x.CustomField02;
        this.sts_BackOrder = x.sts_BackOrder;
        this.sts_Produced = x.sts_Produced;
        this.CustomField01 = x.CustomField01;
        this.id_Design = x.id_Design;
        this.timestamp_Update = x.timestamp_Update;
        this.cn_Display_Status_13 = x.cn_Display_Status_13;
        this.cn_Display_Status_12 = x.cn_Display_Status_12;
        this.cn_Display_Status_11 = x.cn_Display_Status_11;
        this.sts_Shipped = x.sts_Shipped;
        this.cn_Display_Status_10 = x.cn_Display_Status_10;
        this.date_ProductionDone = x.date_ProductionDone;
        this.sts_Paid = x.sts_Paid;
        this.ContactPhone = x.ContactPhone;
        this.sts_PurchasedSub = x.sts_PurchasedSub;
        this.date_OrderShipped = x.date_OrderShipped;
        this.cn_Display_Status_09 = x.cn_Display_Status_09;
        this.cn_Display_Status_08 = x.cn_Display_Status_08;
        this.cn_Display_Status_07 = x.cn_Display_Status_07;
        this.cn_Display_Status_06 = x.cn_Display_Status_06;
        this.cn_Display_Status_05 = x.cn_Display_Status_05;
        this.cn_Display_Status_04 = x.cn_Display_Status_04;
        this.TermsName = x.TermsName;
        this.ContactFax = x.ContactFax;
        this.CustomField08 = x.CustomField08;
        this.CustomField07 = x.CustomField07;
        this.CustomField09 = x.CustomField09;
        this.date_OrderDropDead = x.date_OrderDropDead;
        this.CustomerPurchaseOrder = x.CustomerPurchaseOrder;
        this.NotesToWebSalesperson = x.NotesToWebSalesperson;
        this.slot_09 = x.slot_09;
        this.slot_07 = x.slot_07;
        this.ContactLast = x.ContactLast;
        this.slot_08 = x.slot_08;
        this.cnCur_TotalInvoice = x.cnCur_TotalInvoice;
        this.slot_01 = x.slot_01;
        this.cn_Display_Status_03 = x.cn_Display_Status_03;
        this.slot_02 = x.slot_02;
        this.cn_Display_Status_02 = x.cn_Display_Status_02;
        this.id_OrderType = x.id_OrderType;
        this.cn_Display_Status_01 = x.cn_Display_Status_01;
        this.date_OrderRequestedToShip = x.date_OrderRequestedToShip;
        this.slot_05 = x.slot_05;
        this.slot_06 = x.slot_06;
        this.id_ShippingStatus = x.id_ShippingStatus;
        this.ContactTitle = x.ContactTitle;
        this.slot_03 = x.slot_03;
        this.CustomerServiceRep = x.CustomerServiceRep;
        this.slot_04 = x.slot_04;
        this.id_CustomerInternal = x.id_CustomerInternal;
        this.sts_SizingType = x.sts_SizingType;
        this.ContactEmail = x.ContactEmail;
        this.sts_Invoiced = x.sts_Invoiced;
        this.cur_Payments = x.cur_Payments;
        this.id_Customer = x.id_Customer;
        this.NotesToWebCustomer = x.NotesToWebCustomer;
        this.order_id = x.order_id; // added for update
    }

    // Getters and setters
    getExtOrderID() {
        return this.ExtOrderID;
    }

    setExtOrderID(extOrderID) {
        this.ExtOrderID = extOrderID;
    }

    getExtSource() {
        return this.ExtSource;
    }

    setExtSource(extSource) {
        this.ExtSource = extSource;
    }

    getOrder_id() {
        return this.order_id;
    }

    setOrder_id(order_id) {
        this.order_id = order_id;
    }

    getContactFirst() {
        return this.ContactFirst;
    }

    setContactFirst(contactFirst) {
        this.ContactFirst = contactFirst;
    }

    getID_Order() {
        return this.ID_Order;
    }

    setID_Order(iD_Order) {
        this.ID_Order = iD_Order;
    }

    getCn_sts_HoldOrder() {
        return this.cn_sts_HoldOrder;
    }

    setCn_sts_HoldOrder(cn_sts_HoldOrder) {
        this.cn_sts_HoldOrder = cn_sts_HoldOrder;
    }

    getId_ReceivingStatus() {
        return this.id_ReceivingStatus;
    }

    setId_ReceivingStatus(id_ReceivingStatus) {
        this.id_ReceivingStatus = id_ReceivingStatus;
    }

    getDesignName() {
        return this.DesignName;
    }

    setDesignName(designName) {
        this.DesignName = designName;
    }

    getSlot_12() {
        return this.slot_12;
    }

    setSlot_12(slot_12) {
        this.slot_12 = slot_12;
    }

    getSts_ArtDone() {
        return this.sts_ArtDone;
    }

    setSts_ArtDone(sts_ArtDone) {
        this.sts_ArtDone = sts_ArtDone;
    }

    getSlot_13() {
        return this.slot_13;
    }

    setSlot_13(slot_13) {
        this.slot_13 = slot_13;
    }

    getCur_Shipping() {
        return this.cur_Shipping;
    }

    setCur_Shipping(cur_Shipping) {
        this.cur_Shipping = cur_Shipping;
    }

    getSlot_10() {
        return this.slot_10;
    }

    setSlot_10(slot_10) {
        this.slot_10 = slot_10;
    }

    getSlot_11() {
        return this.slot_11;
    }

    setSlot_11(slot_11) {
        this.slot_11 = slot_11;
    }

    getCur_Adjust() {
        return this.cur_Adjust;
    }

    setCur_Adjust(cur_Adjust) {
        this.cur_Adjust = cur_Adjust;
    }

    getCustomerServiceRepFaxWork() {
        return this.CustomerServiceRepFaxWork;
    }

    setCustomerServiceRepFaxWork(customerServiceRepFaxWork) {
        this.CustomerServiceRepFaxWork = customerServiceRepFaxWork;
    }

    getCnCur_SalesTaxTotal() {
        return this.cnCur_SalesTaxTotal;
    }

    setCnCur_SalesTaxTotal(cnCur_SalesTaxTotal) {
        this.cnCur_SalesTaxTotal = cnCur_SalesTaxTotal;
    }

    getCompanyName() {
        return this.CompanyName;
    }

    setCompanyName(companyName) {
        this.CompanyName = companyName;
    }

    getSts_Purchased() {
        return this.sts_Purchased;
    }

    setSts_Purchased(sts_Purchased) {
        this.sts_Purchased = sts_Purchased;
    }

    getTermsDays() {
        return this.TermsDays;
    }

    setTermsDays(termsDays) {
        this.TermsDays = termsDays;
    }

    getSts_Received() {
        return this.sts_Received;
    }

    setSts_Received(sts_Received) {
        this.sts_Received = sts_Received;
    }

    getAction() {
        return this.action;
    }

    setAction(action) {
        this.action = action;
    }

    getSts_ReceivedSub() {
        return this.sts_ReceivedSub;
    }

    setSts_ReceivedSub(sts_ReceivedSub) {
        this.sts_ReceivedSub = sts_ReceivedSub;
    }

    getCn_TotalProductQty_Current() {
        return this.cn_TotalProductQty_Current;
    }

    setCn_TotalProductQty_Current(cn_TotalProductQty_Current) {
        this.cn_TotalProductQty_Current = cn_TotalProductQty_Current;
    }

    getCur_Subtotal() {
        return this.cur_Subtotal;
    }

    setCur_Subtotal(cur_Subtotal) {
        this.cur_Subtotal = cur_Subtotal;
    }

    getCn_sts_HoldOrderGraphic() {
        return this.cn_sts_HoldOrderGraphic;
    }

    setCn_sts_HoldOrderGraphic(cn_sts_HoldOrderGraphic) {
        this.cn_sts_HoldOrderGraphic = cn_sts_HoldOrderGraphic;
    }

    getCnCur_Balance() {
        return this.cnCur_Balance;
    }

    setCnCur_Balance(cnCur_Balance) {
        this.cnCur_Balance = cnCur_Balance;
    }

    getDate_OrderInvoiced() {
        return this.date_OrderInvoiced;
    }

    setDate_OrderInvoiced(date_OrderInvoiced) {
        this.date_OrderInvoiced = date_OrderInvoiced;
    }

    getCustomField10() {
        return this.CustomField10;
    }

    setCustomField10(customField10) {
        this.CustomField10 = customField10;
    }

    getContactDepartment() {
        return this.ContactDepartment;
    }

    setContactDepartment(contactDepartment) {
        this.ContactDepartment = contactDepartment;
    }

    getCustomerServiceRepPhoneWork() {
        return this.CustomerServiceRepPhoneWork;
    }

    setCustomerServiceRepPhoneWork(customerServiceRepPhoneWork) {
        this.CustomerServiceRepPhoneWork = customerServiceRepPhoneWork;
    }

    getNotesFormsInvoice() {
        return this.NotesFormsInvoice;
    }

    setNotesFormsInvoice(notesFormsInvoice) {
        this.NotesFormsInvoice = notesFormsInvoice;
    }

    getId_CompanyLocation() {
        return this.id_CompanyLocation;
    }

    setId_CompanyLocation(id_CompanyLocation) {
        this.id_CompanyLocation = id_CompanyLocation;
    }

    getCustomerType() {
        return this.CustomerType;
    }

    setCustomerType(customerType) {
        this.CustomerType = customerType;
    }

    getCustomerServiceRepEmailWork() {
        return this.CustomerServiceRepEmailWork;
    }

    setCustomerServiceRepEmailWork(customerServiceRepEmailWork) {
        this.CustomerServiceRepEmailWork = customerServiceRepEmailWork;
    }

    getId_SalesStatus() {
        return this.id_SalesStatus;
    }

    setId_SalesStatus(id_SalesStatus) {
        this.id_SalesStatus = id_SalesStatus;
    }

    getCustomField04() {
        return this.CustomField04;
    }

    setCustomField04(customField04) {
        this.CustomField04 = customField04;
    }

    getCustomField03() {
        return this.CustomField03;
    }

    setCustomField03(customField03) {
        this.CustomField03 = customField03;
    }

    getCustomField06() {
        return this.CustomField06;
    }

    setCustomField06(customField06) {
        this.CustomField06 = customField06;
    }

    getCustomField05() {
        return this.CustomField05;
    }

    setCustomField05(customField05) {
        this.CustomField05 = customField05;
    }

    getDate_OrderPlaced() {
        return this.date_OrderPlaced;
    }

    setDate_OrderPlaced(date_OrderPlaced) {
        this.date_OrderPlaced = date_OrderPlaced;
    }

    getCustomField02() {
        return this.CustomField02;
    }

    setCustomField02(customField02) {
        this.CustomField02 = customField02;
    }

    getSts_BackOrder() {
        return this.sts_BackOrder;
    }

    setSts_BackOrder(sts_BackOrder) {
        this.sts_BackOrder = sts_BackOrder;
    }

    getSts_Produced() {
        return this.sts_Produced;
    }

    setSts_Produced(sts_Produced) {
        this.sts_Produced = sts_Produced;
    }

    getCustomField01() {
        return this.CustomField01;
    }

    setCustomField01(customField01) {
        this.CustomField01 = customField01;
    }

    getId_Design() {
        return this.id_Design;
    }

    setId_Design(id_Design) {
        this.id_Design = id_Design;
    }

    getTimestamp_Update() {
        return this.timestamp_Update;
    }

    setTimestamp_Update(timestamp_Update) {
        this.timestamp_Update = timestamp_Update;
    }

    getCn_Display_Status_13() {
        return this.cn_Display_Status_13;
    }

    setCn_Display_Status_13(cn_Display_Status_13) {
        this.cn_Display_Status_13 = cn_Display_Status_13;
    }

    getCn_Display_Status_12() {
        return this.cn_Display_Status_12;
    }

    setCn_Display_Status_12(cn_Display_Status_12) {
        this.cn_Display_Status_12 = cn_Display_Status_12;
    }

    getCn_Display_Status_11() {
        return this.cn_Display_Status_11;
    }

    setCn_Display_Status_11(cn_Display_Status_11) {
        this.cn_Display_Status_11 = cn_Display_Status_11;
    }

    getSts_Shipped() {
        return this.sts_Shipped;
    }

    setSts_Shipped(sts_Shipped) {
        this.sts_Shipped = sts_Shipped;
    }

    getCn_Display_Status_10() {
        return this.cn_Display_Status_10;
    }

    setCn_Display_Status_10(cn_Display_Status_10) {
        this.cn_Display_Status_10 = cn_Display_Status_10;
    }

    getDate_ProductionDone() {
        return this.date_ProductionDone;
    }

    setDate_ProductionDone(date_ProductionDone) {
        this.date_ProductionDone = date_ProductionDone;
    }

    getSts_Paid() {
        return this.sts_Paid;
    }

    setSts_Paid(sts_Paid) {
        this.sts_Paid = sts_Paid;
    }

    getContactPhone() {
        return this.ContactPhone;
    }

    setContactPhone(contactPhone) {
        this.ContactPhone = contactPhone;
    }

    getSts_PurchasedSub() {
        return this.sts_PurchasedSub;
    }

    setSts_PurchasedSub(sts_PurchasedSub) {
        this.sts_PurchasedSub = sts_PurchasedSub;
    }

    getDate_OrderShipped() {
        return this.date_OrderShipped;
    }

    setDate_OrderShipped(date_OrderShipped) {
        this.date_OrderShipped = date_OrderShipped;
    }

    getCn_Display_Status_09() {
        return this.cn_Display_Status_09;
    }

    setCn_Display_Status_09(cn_Display_Status_09) {
        this.cn_Display_Status_09 = cn_Display_Status_09;
    }

    getCn_Display_Status_08() {
        return this.cn_Display_Status_08;
    }

    setCn_Display_Status_08(cn_Display_Status_08) {
        this.cn_Display_Status_08 = cn_Display_Status_08;
    }

    getCn_Display_Status_07() {
        return this.cn_Display_Status_07;
    }

    setCn_Display_Status_07(cn_Display_Status_07) {
        this.cn_Display_Status_07 = cn_Display_Status_07;
    }

    getCn_Display_Status_06() {
        return this.cn_Display_Status_06;
    }

    setCn_Display_Status_06(cn_Display_Status_06) {
        this.cn_Display_Status_06 = cn_Display_Status_06;
    }

    getCn_Display_Status_05() {
        return this.cn_Display_Status_05;
    }

    setCn_Display_Status_05(cn_Display_Status_05) {
        this.cn_Display_Status_05 = cn_Display_Status_05;
    }

    getCn_Display_Status_04() {
        return this.cn_Display_Status_04;
    }

    setCn_Display_Status_04(cn_Display_Status_04) {
        this.cn_Display_Status_04 = cn_Display_Status_04;
    }

    getTermsName() {
        return this.TermsName;
    }

    setTermsName(termsName) {
        this.TermsName = termsName;
    }

    getContactFax() {
        return this.ContactFax;
    }

    setContactFax(contactFax) {
        this.ContactFax = contactFax;
    }

    getCustomField08() {
        return this.CustomField08;
    }

    setCustomField08(customField08) {
        this.CustomField08 = customField08;
    }

    getCustomField07() {
        return this.CustomField07;
    }

    setCustomField07(customField07) {
        this.CustomField07 = customField07;
    }

    getCustomField09() {
        return this.CustomField09;
    }

    setCustomField09(customField09) {
        this.CustomField09 = customField09;
    }

    getDate_OrderDropDead() {
        return this.date_OrderDropDead;
    }

    setDate_OrderDropDead(date_OrderDropDead) {
        this.date_OrderDropDead = date_OrderDropDead;
    }

    getCustomerPurchaseOrder() {
        return this.CustomerPurchaseOrder;
    }

    setCustomerPurchaseOrder(customerPurchaseOrder) {
        this.CustomerPurchaseOrder = customerPurchaseOrder;
    }

    getNotesToWebSalesperson() {
        return this.NotesToWebSalesperson;
    }

    setNotesToWebSalesperson(notesToWebSalesperson) {
        this.NotesToWebSalesperson = notesToWebSalesperson;
    }

    getSlot_09() {
        return this.slot_09;
    }

    setSlot_09(slot_09) {
        this.slot_09 = slot_09;
    }

    getSlot_07() {
        return this.slot_07;
    }

    setSlot_07(slot_07) {
        this.slot_07 = slot_07;
    }

    getContactLast() {
        return this.ContactLast;
    }

    setContactLast(contactLast) {
        this.ContactLast = contactLast;
    }

    getSlot_08() {
        return this.slot_08;
    }

    setSlot_08(slot_08) {
        this.slot_08 = slot_08;
    }

    getCnCur_TotalInvoice() {
        return this.cnCur_TotalInvoice;
    }

    setCnCur_TotalInvoice(cnCur_TotalInvoice) {
        this.cnCur_TotalInvoice = cnCur_TotalInvoice;
    }

    getSlot_01() {
        return this.slot_01;
    }

    setSlot_01(slot_01) {
        this.slot_01 = slot_01;
    }

    getCn_Display_Status_03() {
        return this.cn_Display_Status_03;
    }

    setCn_Display_Status_03(cn_Display_Status_03) {
        this.cn_Display_Status_03 = cn_Display_Status_03;
    }

    getSlot_02() {
        return this.slot_02;
    }

    setSlot_02(slot_02) {
        this.slot_02 = slot_02;
    }

    getCn_Display_Status_02() {
        return this.cn_Display_Status_02;
    }

    setCn_Display_Status_02(cn_Display_Status_02) {
        this.cn_Display_Status_02 = cn_Display_Status_02;
    }

    getId_OrderType() {
        return this.id_OrderType;
    }

    setId_OrderType(id_OrderType) {
        this.id_OrderType = id_OrderType;
    }

    getCn_Display_Status_01() {
        return this.cn_Display_Status_01;
    }

    setCn_Display_Status_01(cn_Display_Status_01) {
        this.cn_Display_Status_01 = cn_Display_Status_01;
    }

    getDate_OrderRequestedToShip() {
        return this.date_OrderRequestedToShip;
    }

    setDate_OrderRequestedToShip(date_OrderRequestedToShip) {
        this.date_OrderRequestedToShip = date_OrderRequestedToShip;
    }

    getSlot_05() {
        return this.slot_05;
    }

    setSlot_05(slot_05) {
        this.slot_05 = slot_05;
    }

    getSlot_06() {
        return this.slot_06;
    }

    setSlot_06(slot_06) {
        this.slot_06 = slot_06;
    }

    getId_ShippingStatus() {
        return this.id_ShippingStatus;
    }

    setId_ShippingStatus(id_ShippingStatus) {
        this.id_ShippingStatus = id_ShippingStatus;
    }

    getContactTitle() {
        return this.ContactTitle;
    }

    setContactTitle(contactTitle) {
        this.ContactTitle = contactTitle;
    }

    getSlot_03() {
        return this.slot_03;
    }

    setSlot_03(slot_03) {
        this.slot_03 = slot_03;
    }

    getCustomerServiceRep() {
        return this.CustomerServiceRep;
    }

    setCustomerServiceRep(customerServiceRep) {
        this.CustomerServiceRep = customerServiceRep;
    }

    getSlot_04() {
        return this.slot_04;
    }

    setSlot_04(slot_04) {
        this.slot_04 = slot_04;
    }

    getId_CustomerInternal() {
        return this.id_CustomerInternal;
    }

    setId_CustomerInternal(id_CustomerInternal) {
        this.id_CustomerInternal = id_CustomerInternal;
    }

    getSts_SizingType() {
        return this.sts_SizingType;
    }

    setSts_SizingType(sts_SizingType) {
        this.sts_SizingType = sts_SizingType;
    }

    getContactEmail() {
        return this.ContactEmail;
    }

    setContactEmail(contactEmail) {
        this.ContactEmail = contactEmail;
    }

    getSts_Invoiced() {
        return this.sts_Invoiced;
    }

    setSts_Invoiced(sts_Invoiced) {
        this.sts_Invoiced = sts_Invoiced;
    }

    getCur_Payments() {
        return this.cur_Payments;
    }

    setCur_Payments(cur_Payments) {
        this.cur_Payments = cur_Payments;
    }

    getId_Customer() {
        return this.id_Customer;
    }

    setId_Customer(id_Customer) {
        this.id_Customer = id_Customer;
    }

    getNotesToWebCustomer() {
        return this.NotesToWebCustomer;
    }

    setNotesToWebCustomer(notesToWebCustomer) {
        this.NotesToWebCustomer = notesToWebCustomer;
    }

    toString() {
        return `Order [
            ContactFirst=${this.ContactFirst}, 
            ID_Order=${this.ID_Order}, 
            cn_sts_HoldOrder=${this.cn_sts_HoldOrder}, 
            id_ReceivingStatus=${this.id_ReceivingStatus}, 
            DesignName=${this.DesignName}, 
            slot_12=${this.slot_12}, 
            sts_ArtDone=${this.sts_ArtDone}, 
            slot_13=${this.slot_13}, 
            cur_Shipping=${this.cur_Shipping}, 
            slot_10=${this.slot_10}, 
            slot_11=${this.slot_11}, 
            cur_Adjust=${this.cur_Adjust}, 
            CustomerServiceRepFaxWork=${this.CustomerServiceRepFaxWork}, 
            cnCur_SalesTaxTotal=${this.cnCur_SalesTaxTotal}, 
            CompanyName=${this.CompanyName}, 
            sts_Purchased=${this.sts_Purchased}, 
            TermsDays=${this.TermsDays}, 
            sts_Received=${this.sts_Received}, 
            action=${this.action}, 
            sts_ReceivedSub=${this.sts_ReceivedSub}, 
            cn_TotalProductQty_Current=${this.cn_TotalProductQty_Current}, 
            cur_Subtotal=${this.cur_Subtotal}, 
            cn_sts_HoldOrderGraphic=${this.cn_sts_HoldOrderGraphic}, 
            cnCur_Balance=${this.cnCur_Balance}, 
            date_OrderInvoiced=${this.date_OrderInvoiced}, 
            CustomField10=${this.CustomField10}, 
            ContactDepartment=${this.ContactDepartment}, 
            CustomerServiceRepPhoneWork=${this.CustomerServiceRepPhoneWork}, 
            NotesFormsInvoice=${this.NotesFormsInvoice}, 
            id_CompanyLocation=${this.id_CompanyLocation}, 
            CustomerType=${this.CustomerType}, 
            CustomerServiceRepEmailWork=${this.CustomerServiceRepEmailWork}, 
            id_SalesStatus=${this.id_SalesStatus}, 
            CustomField04=${this.CustomField04}, 
            CustomField03=${this.CustomField03}, 
            CustomField06=${this.CustomField06}, 
            CustomField05=${this.CustomField05}, 
            date_OrderPlaced=${this.date_OrderPlaced}, 
            CustomField02=${this.CustomField02}, 
            sts_BackOrder=${this.sts_BackOrder}, 
            sts_Produced=${this.sts_Produced}, 
            CustomField01=${this.CustomField01}, 
            id_Design=${this.id_Design}, 
            timestamp_Update=${this.timestamp_Update}, 
            cn_Display_Status_13=${this.cn_Display_Status_13}, 
            cn_Display_Status_12=${this.cn_Display_Status_12}, 
            cn_Display_Status_11=${this.cn_Display_Status_11}, 
            sts_Shipped=${this.sts_Shipped}, 
            cn_Display_Status_10=${this.cn_Display_Status_10}, 
            date_ProductionDone=${this.date_ProductionDone}, 
            sts_Paid=${this.sts_Paid}, 
            ContactPhone=${this.ContactPhone}, 
            sts_PurchasedSub=${this.sts_PurchasedSub}, 
            date_OrderShipped=${this.date_OrderShipped}, 
            cn_Display_Status_09=${this.cn_Display_Status_09}, 
            cn_Display_Status_08=${this.cn_Display_Status_08}, 
            cn_Display_Status_07=${this.cn_Display_Status_07}, 
            cn_Display_Status_06=${this.cn_Display_Status_06}, 
            cn_Display_Status_05=${this.cn_Display_Status_05}, 
            cn_Display_Status_04=${this.cn_Display_Status_04}, 
            TermsName=${this.TermsName}, 
            ContactFax=${this.ContactFax}, 
            CustomField08=${this.CustomField08}, 
            CustomField07=${this.CustomField07}, 
            CustomField09=${this.CustomField09}, 
            date_OrderDropDead=${this.date_OrderDropDead}, 
            CustomerPurchaseOrder=${this.CustomerPurchaseOrder}, 
            NotesToWebSalesperson=${this.NotesToWebSalesperson}, 
            slot_09=${this.slot_09}, 
            slot_07=${this.slot_07}, 
            ContactLast=${this.ContactLast}, 
            slot_08=${this.slot_08}, 
            cnCur_TotalInvoice=${this.cnCur_TotalInvoice}, 
            slot_01=${this.slot_01}, 
            cn_Display_Status_03=${this.cn_Display_Status_03}, 
            slot_02=${this.slot_02}, 
            cn_Display_Status_02=${this.cn_Display_Status_02}, 
            id_OrderType=${this.id_OrderType}, 
            cn_Display_Status_01=${this.cn_Display_Status_01}, 
            date_OrderRequestedToShip=${this.date_OrderRequestedToShip}, 
            slot_05=${this.slot_05}, 
            slot_06=${this.slot_06}, 
            id_ShippingStatus=${this.id_ShippingStatus}, 
            ContactTitle=${this.ContactTitle}, 
            slot_03=${this.slot_03}, 
            CustomerServiceRep=${this.CustomerServiceRep}, 
            slot_04=${this.slot_04}, 
            id_CustomerInternal=${this.id_CustomerInternal}, 
            sts_SizingType=${this.sts_SizingType}, 
            ContactEmail=${this.ContactEmail}, 
            sts_Invoiced=${this.sts_Invoiced}, 
            cur_Payments=${this.cur_Payments}, 
            id_Customer=${this.id_Customer}, 
            NotesToWebCustomer=${this.NotesToWebCustomer}, 
            ExtOrderID=${this.ExtOrderID}, 
            ExtSource=${this.ExtSource}
        ]`;
    }
    
}

module.exports = Order;