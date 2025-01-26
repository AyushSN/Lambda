const Attributes = {
    // Cwide sync attributes
    cwideattr: [
        "HoldMessage", "Label_DropDeadDate", "Label_RequestedShipDate", "Label_SalesTax",
        "Label_Shipping", "pref_ReleaseMechanism", "size_SizeHeader1a", "size_SizeHeader1b",
        "size_SizeHeader2a", "size_SizeHeader2b", "size_SizeHeader3a", "size_SizeHeader3b",
        "size_SizeHeader4a", "size_SizeHeader4b", "size_SizeHeader5a", "size_SizeHeader5b",
        "size_SizeHeader6a", "size_SizeHeader6b", "size_SizeHeaderTexta", "size_SizeHeaderTextb"
    ],

    // Orders attributes for sync order
    orderAttr: [
        "CustomerPurchaseOrder", "CustomerServiceRep", "CustomerServiceRepEmailWork",
        "CustomerServiceRepFaxWork", "CustomerServiceRepPhoneWork", "CustomField01", "CustomField02",
        "CustomField03", "CustomField04", "CustomField05", "CustomField06", "CustomField07",
        "CustomField08", "CustomField09", "CustomField10", "cn_Display_Status_01", "cn_Display_Status_02",
        "cn_Display_Status_03", "cn_Display_Status_04", "cn_Display_Status_05", "cn_Display_Status_06",
        "cn_Display_Status_07", "cn_Display_Status_08", "cn_Display_Status_09", "cn_Display_Status_10",
        "cn_Display_Status_11", "cn_Display_Status_12", "cn_Display_Status_13", "slot_01", "slot_02",
        "slot_03", "slot_04", "slot_05", "slot_06", "slot_07", "slot_08", "slot_09", "slot_10",
        "slot_11", "slot_12", "slot_13", "NotesToWebCustomer", "NotesFormsInvoice", "NotesToWebSalesperson"
    ],

    // Products attributes for sync order
    productAttr: [
        "cn_Size01_Current", "cn_Size02_Current", "cn_Size03_Current", "cn_Size04_Current",
        "cn_Size05_Current", "cn_Size06_Current", "Custom01", "Custom02", "Custom03", "Custom04",
        "Custom05", "id_Contact", "OrderInvoiceNotes", "PartColor", "PartDescriptionPrint", "SortMaster",
        "PartNumberPrint"
    ],

    // Products attributes for sync Asc
    ascAttr: [
        "acs_OrdersLink_Access", "acs_OrdersLink_cn_sts_Ready", "acs_OrdersLink_ExternalSalesperson"
    ],

    // Products attributes for sync Asc
    orderStatusAttr: [
        "Description", "Header", "sts_Slot", "sts_Used"
    ]
};

module.exports = Attributes;
