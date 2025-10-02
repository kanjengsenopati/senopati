const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Quality_controlDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const quality_control = await db.quality_control.create(
      {
        id: data.id || undefined,

        check_point: data.check_point || null,
        passed: data.passed || false,

        check_date: data.check_date || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await quality_control.setWork_order(data.work_order || null, {
      transaction,
    });

    return quality_control;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const quality_controlData = data.map((item, index) => ({
      id: item.id || undefined,

      check_point: item.check_point || null,
      passed: item.passed || false,

      check_date: item.check_date || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const quality_control = await db.quality_control.bulkCreate(
      quality_controlData,
      { transaction },
    );

    // For each item created, replace relation files

    return quality_control;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const quality_control = await db.quality_control.findByPk(
      id,
      {},
      { transaction },
    );

    const updatePayload = {};

    if (data.check_point !== undefined)
      updatePayload.check_point = data.check_point;

    if (data.passed !== undefined) updatePayload.passed = data.passed;

    if (data.check_date !== undefined)
      updatePayload.check_date = data.check_date;

    updatePayload.updatedById = currentUser.id;

    await quality_control.update(updatePayload, { transaction });

    if (data.work_order !== undefined) {
      await quality_control.setWork_order(
        data.work_order,

        { transaction },
      );
    }

    return quality_control;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const quality_control = await db.quality_control.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of quality_control) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of quality_control) {
        await record.destroy({ transaction });
      }
    });

    return quality_control;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const quality_control = await db.quality_control.findByPk(id, options);

    await quality_control.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await quality_control.destroy({
      transaction,
    });

    return quality_control;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const quality_control = await db.quality_control.findOne(
      { where },
      { transaction },
    );

    if (!quality_control) {
      return quality_control;
    }

    const output = quality_control.get({ plain: true });

    output.work_order = await quality_control.getWork_order({
      transaction,
    });

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

    let include = [
      {
        model: db.work_orders,
        as: 'work_order',

        where: filter.work_order
          ? {
              [Op.or]: [
                {
                  id: {
                    [Op.in]: filter.work_order
                      .split('|')
                      .map((term) => Utils.uuid(term)),
                  },
                },
                {
                  order_number: {
                    [Op.or]: filter.work_order
                      .split('|')
                      .map((term) => ({ [Op.iLike]: `%${term}%` })),
                  },
                },
              ],
            }
          : {},
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.check_point) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'quality_control',
            'check_point',
            filter.check_point,
          ),
        };
      }

      if (filter.check_dateRange) {
        const [start, end] = filter.check_dateRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            check_date: {
              ...where.check_date,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            check_date: {
              ...where.check_date,
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

      if (filter.passed) {
        where = {
          ...where,
          passed: filter.passed,
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
      const { rows, count } = await db.quality_control.findAndCountAll(
        queryOptions,
      );

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
          Utils.ilike('quality_control', 'check_point', query),
        ],
      };
    }

    const records = await db.quality_control.findAll({
      attributes: ['id', 'check_point'],
      where,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      orderBy: [['check_point', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.check_point,
    }));
  }
};
