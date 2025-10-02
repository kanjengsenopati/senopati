const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class InventoryDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const inventory = await db.inventory.create(
      {
        id: data.id || undefined,

        item_name: data.item_name || null,
        quantity_available: data.quantity_available || null,
        quantity_reserved: data.quantity_reserved || null,
        quantity_returned: data.quantity_returned || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    return inventory;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const inventoryData = data.map((item, index) => ({
      id: item.id || undefined,

      item_name: item.item_name || null,
      quantity_available: item.quantity_available || null,
      quantity_reserved: item.quantity_reserved || null,
      quantity_returned: item.quantity_returned || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const inventory = await db.inventory.bulkCreate(inventoryData, {
      transaction,
    });

    // For each item created, replace relation files

    return inventory;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const inventory = await db.inventory.findByPk(id, {}, { transaction });

    const updatePayload = {};

    if (data.item_name !== undefined) updatePayload.item_name = data.item_name;

    if (data.quantity_available !== undefined)
      updatePayload.quantity_available = data.quantity_available;

    if (data.quantity_reserved !== undefined)
      updatePayload.quantity_reserved = data.quantity_reserved;

    if (data.quantity_returned !== undefined)
      updatePayload.quantity_returned = data.quantity_returned;

    updatePayload.updatedById = currentUser.id;

    await inventory.update(updatePayload, { transaction });

    return inventory;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const inventory = await db.inventory.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of inventory) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of inventory) {
        await record.destroy({ transaction });
      }
    });

    return inventory;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const inventory = await db.inventory.findByPk(id, options);

    await inventory.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await inventory.destroy({
      transaction,
    });

    return inventory;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const inventory = await db.inventory.findOne({ where }, { transaction });

    if (!inventory) {
      return inventory;
    }

    const output = inventory.get({ plain: true });

    return output;
  }

  static async findAll(filter, options) {
    const limit = filter.limit || 0;
    let offset = 0;
    let where = {};
    const currentPage = +filter.page;

    offset = currentPage * limit;

    const orderBy = null;

    const transaction = (options && options.transaction) || undefined;

    let include = [];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.item_name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('inventory', 'item_name', filter.item_name),
        };
      }

      if (filter.quantity_availableRange) {
        const [start, end] = filter.quantity_availableRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            quantity_available: {
              ...where.quantity_available,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            quantity_available: {
              ...where.quantity_available,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.quantity_reservedRange) {
        const [start, end] = filter.quantity_reservedRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            quantity_reserved: {
              ...where.quantity_reserved,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            quantity_reserved: {
              ...where.quantity_reserved,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.quantity_returnedRange) {
        const [start, end] = filter.quantity_returnedRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            quantity_returned: {
              ...where.quantity_returned,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            quantity_returned: {
              ...where.quantity_returned,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.active !== undefined) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.lte]: end,
            },
          };
        }
      }
    }

    const queryOptions = {
      where,
      include,
      distinct: true,
      order:
        filter.field && filter.sort
          ? [[filter.field, filter.sort]]
          : [['createdAt', 'desc']],
      transaction: options?.transaction,
      logging: console.log,
    };

    if (!options?.countOnly) {
      queryOptions.limit = limit ? Number(limit) : undefined;
      queryOptions.offset = offset ? Number(offset) : undefined;
    }

    try {
      const { rows, count } = await db.inventory.findAndCountAll(queryOptions);

      return {
        rows: options?.countOnly ? [] : rows,
        count: count,
      };
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  }

  static async findAllAutocomplete(query, limit, offset) {
    let where = {};

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike('inventory', 'item_name', query),
        ],
      };
    }

    const records = await db.inventory.findAll({
      attributes: ['id', 'item_name'],
      where,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      orderBy: [['item_name', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.item_name,
    }));
  }
};
