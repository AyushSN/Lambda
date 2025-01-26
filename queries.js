const insertQueryForDesignType = async (destyp, connection) => {
    const query = `
      INSERT INTO design_types (design_type_no, type, customer_internal_id, created_at, updated_at)
      VALUES (?, ?, ?, NOW(), NOW())
    `;
    const [result] = await connection.execute(query, [
      destyp.ID_DesignType,
      destyp.DesignType,
      destyp.id_CustomerInternal,
    ]);
  
    return `Record inserted successfully for design type id: ${destyp.ID_DesignType}\n`;
  };
  
  const updateQueryForDesignType = async (destyp, connection) => {
    const query = `
      UPDATE design_types
      SET design_type_no = ?, type = ?, customer_internal_id = ?, updated_at = NOW()
      WHERE design_type_no = ? AND customer_internal_id = ?
    `;
    const [result] = await connection.execute(query, [
      destyp.ID_DesignType,
      destyp.DesignType,
      destyp.id_CustomerInternal,
      destyp.ID_DesignType,
      destyp.id_CustomerInternal,
    ]);
  
    return `Record updated successfully for design type id: ${destyp.ID_DesignType}\n`;
  };
  
  const deleteQueryForDesignType = async (destyp, connection) => {
    const query = `
      DELETE FROM design_types
      WHERE design_type_no = ? AND customer_internal_id = ?
    `;
    const [result] = await connection.execute(query, [
      destyp.ID_DesignType,
      destyp.id_CustomerInternal,
    ]);
  
    return `Record deleted successfully for design type id: ${destyp.ID_DesignType}\n`;
  };
  
  module.exports = { insertQueryForDesignType, updateQueryForDesignType, deleteQueryForDesignType };
  