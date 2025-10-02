const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class EmployeesDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const employees = await db.employees.create(
      {
        id: data.id || undefined,

        full_name: data.full_name || null,
        role: data.role || null,
        salary: data.salary || null,
        shift: data.shift || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await employees.setManager(data.manager || null, {
      transaction,
    });

    return employees;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const employeesData = data.map((item, index) => ({
      id: item.id || undefined,

      full_name: item.full_name || null,
      role: item.role || null,
      salary: item.salary || null,
      shift: item.shift || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const employees = await db.employees.bulkCreate(employeesData, {
      transaction,
    });

    // For each item created, replace relation files

    return employees;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const employees = await db.employees.findByPk(id, {}, { transaction });

    const updatePayload = {};

    if (data.full_name !== undefined) updatePayload.full_name = data.full_name;

    if (data.role !== undefined) updatePayload.role = data.role;

    if (data.salary !== undefined) updatePayload.salary = data.salary;

    if (data.shift !== undefined) updatePayload.shift = data.shift;

    updatePayload.updatedById = currentUser.id;

    await employees.update(updatePayload, { transaction });

    if (data.manager !== undefined) {
      await employees.setManager(
        data.manager,

        { transaction },
      );
    }

    return employees;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const employees = await db.employees.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of employees) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of employees) {
        await record.destroy({ transaction });
      }
    });

    return employees;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const employees = await db.employees.findByPk(id, options);

    await employees.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await employees.destroy({
      transaction,
    });

    return employees;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const employees = await db.employees.findOne({ where }, { transaction });

    if (!employees) {
      return employees;
    }

    const output = employees.get({ plain: true });

    output.manager = await employees.getManager({
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
        model: db.users,
        as: 'manager',

        where: filter.manager
          ? {
              [Op.or]: [
                {
                  id: {
                    [Op.in]: filter.manager
                      .split('|')
                      .map((term) => Utils.uuid(term)),
                  },
                },
                {
                  firstName: {
                    [Op.or]: filter.manager
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

      if (filter.full_name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('employees', 'full_name', filter.full_name),
        };
      }

      if (filter.role) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('employees', 'role', filter.role),
        };
      }

      if (filter.shift) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('employees', 'shift', filter.shift),
        };
      }

      if (filter.salaryRange) {
        const [start, end] = filter.salaryRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            salary: {
              ...where.salary,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            salary: {
              ...where.salary,
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
      const { rows, count } = await db.employees.findAndCountAll(queryOptions);

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
          Utils.ilike('employees', 'full_name', query),
        ],
      };
    }

    const records = await db.employees.findAll({
      attributes: ['id', 'full_name'],
      where,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      orderBy: [['full_name', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.full_name,
    }));
  }
};
