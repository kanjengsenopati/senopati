const db = require('../models');
const Users = db.users;

const Employees = db.employees;

const Inventory = db.inventory;

const Machinery = db.machinery;

const QualityControl = db.quality_control;

const RawMaterials = db.raw_materials;

const Suppliers = db.suppliers;

const WorkOrders = db.work_orders;

const EmployeesData = [
  {
    full_name: 'John Doe',

    role: 'Production Manager',

    // type code here for "relation_one" field

    salary: 75000,

    shift: 'Day',
  },

  {
    full_name: 'Jane Smith',

    role: 'Inventory Manager',

    // type code here for "relation_one" field

    salary: 70000,

    shift: 'Night',
  },

  {
    full_name: 'Emily Johnson',

    role: 'Quality Control Officer',

    // type code here for "relation_one" field

    salary: 65000,

    shift: 'Day',
  },

  {
    full_name: 'Michael Brown',

    role: 'HR Manager',

    // type code here for "relation_one" field

    salary: 80000,

    shift: 'Day',
  },

  {
    full_name: 'Sarah Davis',

    role: 'Production Worker',

    // type code here for "relation_one" field

    salary: 50000,

    shift: 'Night',
  },
];

const InventoryData = [
  {
    item_name: 'Finished Steel Beams',

    quantity_available: 2000,

    quantity_reserved: 500,

    quantity_returned: 100,
  },

  {
    item_name: 'Aluminum Panels',

    quantity_available: 1500,

    quantity_reserved: 300,

    quantity_returned: 50,
  },

  {
    item_name: 'Copper Coils',

    quantity_available: 1000,

    quantity_reserved: 200,

    quantity_returned: 30,
  },

  {
    item_name: 'Plastic Tubes',

    quantity_available: 5000,

    quantity_reserved: 1000,

    quantity_returned: 200,
  },

  {
    item_name: 'Rubber Seals',

    quantity_available: 3000,

    quantity_reserved: 600,

    quantity_returned: 100,
  },
];

const MachineryData = [
  {
    name: 'CNC Machine',

    model: 'CNC-2000',

    maintenance_schedule: new Date('2023-11-01T10:00:00Z'),

    is_operational: true,
  },

  {
    name: 'Laser Cutter',

    model: 'LC-500',

    maintenance_schedule: new Date('2023-11-05T10:00:00Z'),

    is_operational: true,
  },

  {
    name: '3D Printer',

    model: '3DP-100',

    maintenance_schedule: new Date('2023-11-10T10:00:00Z'),

    is_operational: true,
  },

  {
    name: 'Hydraulic Press',

    model: 'HP-300',

    maintenance_schedule: new Date('2023-11-15T10:00:00Z'),

    is_operational: true,
  },

  {
    name: 'Welding Robot',

    model: 'WR-400',

    maintenance_schedule: new Date('2023-11-20T10:00:00Z'),

    is_operational: true,
  },
];

const QualityControlData = [
  {
    check_point: 'Initial Inspection',

    // type code here for "relation_one" field

    passed: true,

    check_date: new Date('2023-10-02T09:00:00Z'),
  },

  {
    check_point: 'Mid-Production Check',

    // type code here for "relation_one" field

    passed: false,

    check_date: new Date('2023-10-07T11:00:00Z'),
  },

  {
    check_point: 'Final Inspection',

    // type code here for "relation_one" field

    passed: true,

    check_date: new Date('2023-10-12T15:00:00Z'),
  },

  {
    check_point: 'Random Check',

    // type code here for "relation_one" field

    passed: true,

    check_date: new Date('2023-10-17T14:00:00Z'),
  },

  {
    check_point: 'Pre-Delivery Check',

    // type code here for "relation_one" field

    passed: true,

    check_date: new Date('2023-10-22T16:00:00Z'),
  },
];

const RawMaterialsData = [
  {
    name: 'Steel Sheets',

    quantity: 5000,

    reorder_level: 1000,

    // type code here for "relation_many" field
  },

  {
    name: 'Aluminum Rods',

    quantity: 3000,

    reorder_level: 500,

    // type code here for "relation_many" field
  },

  {
    name: 'Copper Wires',

    quantity: 2000,

    reorder_level: 300,

    // type code here for "relation_many" field
  },

  {
    name: 'Plastic Pellets',

    quantity: 10000,

    reorder_level: 2000,

    // type code here for "relation_many" field
  },

  {
    name: 'Rubber Gaskets',

    quantity: 1500,

    reorder_level: 200,

    // type code here for "relation_many" field
  },
];

const SuppliersData = [
  {
    name: 'Global Metals Inc.',

    contact_details: 'contact@globalmetals.com',

    contract_terms: 'Annual contract with quarterly reviews.',

    delivery_schedule: new Date('2023-10-15T10:00:00Z'),
  },

  {
    name: 'AluSource Ltd.',

    contact_details: 'info@alusource.com',

    contract_terms: 'Bi-annual contract with monthly deliveries.',

    delivery_schedule: new Date('2023-10-20T10:00:00Z'),
  },

  {
    name: 'Copper World',

    contact_details: 'sales@copperworld.com',

    contract_terms: 'Flexible contract with on-demand orders.',

    delivery_schedule: new Date('2023-10-25T10:00:00Z'),
  },

  {
    name: 'Plastics Plus',

    contact_details: 'support@plasticsplus.com',

    contract_terms: 'Long-term contract with bi-weekly deliveries.',

    delivery_schedule: new Date('2023-10-30T10:00:00Z'),
  },

  {
    name: 'RubberTech',

    contact_details: 'service@rubbertech.com',

    contract_terms: 'Short-term contract with weekly deliveries.',

    delivery_schedule: new Date('2023-11-05T10:00:00Z'),
  },
];

const WorkOrdersData = [
  {
    order_number: 'WO-001',

    // type code here for "relation_one" field

    // type code here for "relation_many" field

    // type code here for "relation_many" field

    start_date: new Date('2023-10-01T08:00:00Z'),

    end_date: new Date('2023-10-05T17:00:00Z'),
  },

  {
    order_number: 'WO-002',

    // type code here for "relation_one" field

    // type code here for "relation_many" field

    // type code here for "relation_many" field

    start_date: new Date('2023-10-06T08:00:00Z'),

    end_date: new Date('2023-10-10T17:00:00Z'),
  },

  {
    order_number: 'WO-003',

    // type code here for "relation_one" field

    // type code here for "relation_many" field

    // type code here for "relation_many" field

    start_date: new Date('2023-10-11T08:00:00Z'),

    end_date: new Date('2023-10-15T17:00:00Z'),
  },

  {
    order_number: 'WO-004',

    // type code here for "relation_one" field

    // type code here for "relation_many" field

    // type code here for "relation_many" field

    start_date: new Date('2023-10-16T08:00:00Z'),

    end_date: new Date('2023-10-20T17:00:00Z'),
  },

  {
    order_number: 'WO-005',

    // type code here for "relation_one" field

    // type code here for "relation_many" field

    // type code here for "relation_many" field

    start_date: new Date('2023-10-21T08:00:00Z'),

    end_date: new Date('2023-10-25T17:00:00Z'),
  },
];

// Similar logic for "relation_many"

async function associateEmployeeWithManager() {
  const relatedManager0 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Employee0 = await Employees.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Employee0?.setManager) {
    await Employee0.setManager(relatedManager0);
  }

  const relatedManager1 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Employee1 = await Employees.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Employee1?.setManager) {
    await Employee1.setManager(relatedManager1);
  }

  const relatedManager2 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Employee2 = await Employees.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Employee2?.setManager) {
    await Employee2.setManager(relatedManager2);
  }

  const relatedManager3 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Employee3 = await Employees.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Employee3?.setManager) {
    await Employee3.setManager(relatedManager3);
  }

  const relatedManager4 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Employee4 = await Employees.findOne({
    order: [['id', 'ASC']],
    offset: 4,
  });
  if (Employee4?.setManager) {
    await Employee4.setManager(relatedManager4);
  }
}

async function associateQualityControlWithWork_order() {
  const relatedWork_order0 = await WorkOrders.findOne({
    offset: Math.floor(Math.random() * (await WorkOrders.count())),
  });
  const QualityControl0 = await QualityControl.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (QualityControl0?.setWork_order) {
    await QualityControl0.setWork_order(relatedWork_order0);
  }

  const relatedWork_order1 = await WorkOrders.findOne({
    offset: Math.floor(Math.random() * (await WorkOrders.count())),
  });
  const QualityControl1 = await QualityControl.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (QualityControl1?.setWork_order) {
    await QualityControl1.setWork_order(relatedWork_order1);
  }

  const relatedWork_order2 = await WorkOrders.findOne({
    offset: Math.floor(Math.random() * (await WorkOrders.count())),
  });
  const QualityControl2 = await QualityControl.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (QualityControl2?.setWork_order) {
    await QualityControl2.setWork_order(relatedWork_order2);
  }

  const relatedWork_order3 = await WorkOrders.findOne({
    offset: Math.floor(Math.random() * (await WorkOrders.count())),
  });
  const QualityControl3 = await QualityControl.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (QualityControl3?.setWork_order) {
    await QualityControl3.setWork_order(relatedWork_order3);
  }

  const relatedWork_order4 = await WorkOrders.findOne({
    offset: Math.floor(Math.random() * (await WorkOrders.count())),
  });
  const QualityControl4 = await QualityControl.findOne({
    order: [['id', 'ASC']],
    offset: 4,
  });
  if (QualityControl4?.setWork_order) {
    await QualityControl4.setWork_order(relatedWork_order4);
  }
}

// Similar logic for "relation_many"

async function associateWorkOrderWithProduction_manager() {
  const relatedProduction_manager0 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const WorkOrder0 = await WorkOrders.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (WorkOrder0?.setProduction_manager) {
    await WorkOrder0.setProduction_manager(relatedProduction_manager0);
  }

  const relatedProduction_manager1 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const WorkOrder1 = await WorkOrders.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (WorkOrder1?.setProduction_manager) {
    await WorkOrder1.setProduction_manager(relatedProduction_manager1);
  }

  const relatedProduction_manager2 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const WorkOrder2 = await WorkOrders.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (WorkOrder2?.setProduction_manager) {
    await WorkOrder2.setProduction_manager(relatedProduction_manager2);
  }

  const relatedProduction_manager3 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const WorkOrder3 = await WorkOrders.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (WorkOrder3?.setProduction_manager) {
    await WorkOrder3.setProduction_manager(relatedProduction_manager3);
  }

  const relatedProduction_manager4 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const WorkOrder4 = await WorkOrders.findOne({
    order: [['id', 'ASC']],
    offset: 4,
  });
  if (WorkOrder4?.setProduction_manager) {
    await WorkOrder4.setProduction_manager(relatedProduction_manager4);
  }
}

// Similar logic for "relation_many"

// Similar logic for "relation_many"

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Employees.bulkCreate(EmployeesData);

    await Inventory.bulkCreate(InventoryData);

    await Machinery.bulkCreate(MachineryData);

    await QualityControl.bulkCreate(QualityControlData);

    await RawMaterials.bulkCreate(RawMaterialsData);

    await Suppliers.bulkCreate(SuppliersData);

    await WorkOrders.bulkCreate(WorkOrdersData);

    await Promise.all([
      // Similar logic for "relation_many"

      await associateEmployeeWithManager(),

      await associateQualityControlWithWork_order(),

      // Similar logic for "relation_many"

      await associateWorkOrderWithProduction_manager(),

      // Similar logic for "relation_many"

      // Similar logic for "relation_many"
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('employees', null, {});

    await queryInterface.bulkDelete('inventory', null, {});

    await queryInterface.bulkDelete('machinery', null, {});

    await queryInterface.bulkDelete('quality_control', null, {});

    await queryInterface.bulkDelete('raw_materials', null, {});

    await queryInterface.bulkDelete('suppliers', null, {});

    await queryInterface.bulkDelete('work_orders', null, {});
  },
};
