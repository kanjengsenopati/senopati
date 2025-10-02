const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const inventory = sequelize.define(
    'inventory',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      item_name: {
        type: DataTypes.TEXT,
      },

      quantity_available: {
        type: DataTypes.DECIMAL,
      },

      quantity_reserved: {
        type: DataTypes.DECIMAL,
      },

      quantity_returned: {
        type: DataTypes.DECIMAL,
      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  inventory.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.inventory.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.inventory.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return inventory;
};
