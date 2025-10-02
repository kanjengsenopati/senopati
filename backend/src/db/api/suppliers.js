const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class SuppliersDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const suppliers = await db.suppliers.create(
      {
        id: data.id || undefined,

        name: data.name || null,
        contact_details: data.contact_details || null,
        contract_terms: data.contract_terms || null,
        delivery_schedule: data.delivery_schedule || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    return suppliers;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const suppliersData = data.map((item, index) => ({
      id: item.id || undefined,

      name: item.name || null,
      contact_details: item.contact_details || null,
      contract_terms: item.contract_terms || null,
      delivery_schedule: item.delivery_schedule || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const suppliers = await db.suppliers.bulkCreate(suppliersData, {
      transaction,
    });

    // For each item created, replace relation files

    return suppliers;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const suppliers = await db.suppliers.findByPk(id, {}, { transaction });

    const updatePayload = {};

    if (data.name !== undefined) updatePayload.name = data.name;

    if (data.contact_details !== undefined)
      updatePayload.contact_details = data.contact_details;

    if (data.contract_terms !== undefined)
      updatePayload.contract_terms = data.contract_terms;

    if (data.delivery_schedule !== undefined)
      updatePayload.delivery_schedule = data.delivery_schedule;

    updatePayload.updatedById = currentUser.id;

    await suppliers.update(updatePayload, { transaction });

    return suppliers;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const suppliers = await db.suppliers.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of suppliers) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of suppliers) {
        await record.destroy({ transaction });
      }
    });

    return suppliers;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const suppliers = await db.suppliers.findByPk(id, options);

    await suppliers.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await suppliers.destroy({
      transaction,
    });

    return suppliers;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const suppliers = await db.suppliers.findOne({ where }, { transaction });

    if (!suppliers) {
      return suppliers;
    }

    const output = suppliers.get({ plain: true });

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

      if (filter.name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('suppliers', 'name', filter.name),
        };
      }

      if (filter.contact_details) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'suppliers',
            'contact_details',
            filter.contact_details,
          ),
        };
      }

      if (filter.contract_terms) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'suppliers',
            'contract_terms',
            filter.contract_terms,
          ),
        };
      }

      if (filter.delivery_scheduleRange) {
        const [start, end] = filter.delivery_scheduleRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            delivery_schedule: {
              ...where.delivery_schedule,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            delivery_schedule: {
              ...where.delivery_schedule,
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
      const { rows, count } = await db.suppliers.findAndCountAll(queryOptions);

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
          Utils.ilike('suppliers', 'name', query),
        ],
      };
    }

    const records = await db.suppliers.findAll({
      attributes: ['id', 'name'],
      where,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      orderBy: [['name', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.name,
    }));
  }
};
