import * as icon from '@mdi/js';
import Head from 'next/head';
import React from 'react';
import axios from 'axios';
import type { ReactElement } from 'react';
import LayoutAuthenticated from '../layouts/Authenticated';
import SectionMain from '../components/SectionMain';
import SectionTitleLineWithButton from '../components/SectionTitleLineWithButton';
import BaseIcon from '../components/BaseIcon';
import { getPageTitle } from '../config';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

import { hasPermission } from '../helpers/userPermissions';
import { fetchWidgets } from '../stores/roles/rolesSlice';
import { WidgetCreator } from '../components/WidgetCreator/WidgetCreator';
import { SmartWidget } from '../components/SmartWidget/SmartWidget';

import { useAppDispatch, useAppSelector } from '../stores/hooks';
const Dashboard = () => {
  const { t } = useTranslation('common');
  const dispatch = useAppDispatch();
  const iconsColor = useAppSelector((state) => state.style.iconsColor);
  const corners = useAppSelector((state) => state.style.corners);
  const cardsStyle = useAppSelector((state) => state.style.cardsStyle);

  const loadingMessage = t('pages.dashboard.loading', {
    defaultValue: 'Loading...',
  });

  const [users, setUsers] = React.useState(loadingMessage);
  const [employees, setEmployees] = React.useState(loadingMessage);
  const [inventory, setInventory] = React.useState(loadingMessage);
  const [machinery, setMachinery] = React.useState(loadingMessage);
  const [quality_control, setQuality_control] = React.useState(loadingMessage);
  const [raw_materials, setRaw_materials] = React.useState(loadingMessage);
  const [suppliers, setSuppliers] = React.useState(loadingMessage);
  const [work_orders, setWork_orders] = React.useState(loadingMessage);
  const [roles, setRoles] = React.useState(loadingMessage);
  const [permissions, setPermissions] = React.useState(loadingMessage);

  const [widgetsRole, setWidgetsRole] = React.useState({
    role: { value: '', label: '' },
  });
  const { currentUser } = useAppSelector((state) => state.auth);
  const { isFetchingQuery } = useAppSelector((state) => state.openAi);

  const { rolesWidgets, loading } = useAppSelector((state) => state.roles);

  async function loadData() {
    const entities = [
      'users',
      'employees',
      'inventory',
      'machinery',
      'quality_control',
      'raw_materials',
      'suppliers',
      'work_orders',
      'roles',
      'permissions',
    ];
    const fns = [
      setUsers,
      setEmployees,
      setInventory,
      setMachinery,
      setQuality_control,
      setRaw_materials,
      setSuppliers,
      setWork_orders,
      setRoles,
      setPermissions,
    ];

    const requests = entities.map((entity, index) => {
      if (hasPermission(currentUser, `READ_${entity.toUpperCase()}`)) {
        return axios.get(`/${entity.toLowerCase()}/count`);
      } else {
        fns[index](null);
        return Promise.resolve({ data: { count: null } });
      }
    });

    Promise.allSettled(requests).then((results) => {
      results.forEach((result, i) => {
        if (result.status === 'fulfilled') {
          fns[i](result.value.data.count);
        } else {
          fns[i](result.reason.message);
        }
      });
    });
  }

  async function getWidgets(roleId) {
    await dispatch(fetchWidgets(roleId));
  }
  React.useEffect(() => {
    if (!currentUser) return;
    loadData().then();
    setWidgetsRole({
      role: {
        value: currentUser?.app_role?.id,
        label: currentUser?.app_role?.name,
      },
    });
  }, [currentUser]);

  React.useEffect(() => {
    if (!currentUser || !widgetsRole?.role?.value) return;
    getWidgets(widgetsRole?.role?.value || '').then();
  }, [widgetsRole?.role?.value]);

  return (
    <>
      <Head>
        <title>
          {getPageTitle(
            t('pages.dashboard.pageTitle', { defaultValue: 'Overview' }),
          )}
        </title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={icon.mdiChartTimelineVariant}
          title={t('pages.dashboard.overview', { defaultValue: 'Overview' })}
          main
        >
          {''}
        </SectionTitleLineWithButton>

        {hasPermission(currentUser, 'CREATE_ROLES') && (
          <WidgetCreator
            currentUser={currentUser}
            isFetchingQuery={isFetchingQuery}
            setWidgetsRole={setWidgetsRole}
            widgetsRole={widgetsRole}
          />
        )}
        {!!rolesWidgets.length &&
          hasPermission(currentUser, 'CREATE_ROLES') && (
            <p className='  text-gray-500 dark:text-gray-400 mb-4'>
              {`${widgetsRole?.role?.label || 'Users'}'s widgets`}
            </p>
          )}

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-4 mb-6 grid-flow-dense'>
          {(isFetchingQuery || loading) && (
            <div
              className={` ${
                corners !== 'rounded-full' ? corners : 'rounded-3xl'
              } dark:bg-dark-900 text-lg leading-tight   text-gray-500 flex items-center ${cardsStyle} dark:border-dark-700 p-6`}
            >
              <BaseIcon
                className={`${iconsColor} animate-spin mr-5`}
                w='w-16'
                h='h-16'
                size={48}
                path={icon.mdiLoading}
              />{' '}
              {t('pages.dashboard.loadingWidgets', {
                defaultValue: 'Loading widgets...',
              })}
            </div>
          )}

          {rolesWidgets &&
            rolesWidgets.map((widget) => (
              <SmartWidget
                key={widget.id}
                userId={currentUser?.id}
                widget={widget}
                roleId={widgetsRole?.role?.value || ''}
                admin={hasPermission(currentUser, 'CREATE_ROLES')}
              />
            ))}
        </div>

        {!!rolesWidgets.length && <hr className='my-6  ' />}

        <div
          id='dashboard'
          className='grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6'
        >
          {hasPermission(currentUser, 'READ_USERS') && (
            <Link href={'/users/users-list'}>
              <div
                className={`${
                  corners !== 'rounded-full' ? corners : 'rounded-3xl'
                } dark:bg-dark-900 ${cardsStyle} dark:border-dark-700 p-6`}
              >
                <div className='flex justify-between align-center'>
                  <div>
                    <div className='text-lg leading-tight   text-gray-500 dark:text-gray-400'>
                      Users
                    </div>
                    <div className='text-3xl leading-tight font-semibold'>
                      {users}
                    </div>
                  </div>
                  <div>
                    <BaseIcon
                      className={`${iconsColor}`}
                      w='w-16'
                      h='h-16'
                      size={48}
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      path={icon.mdiAccountGroup || icon.mdiTable}
                    />
                  </div>
                </div>
              </div>
            </Link>
          )}

          {hasPermission(currentUser, 'READ_EMPLOYEES') && (
            <Link href={'/employees/employees-list'}>
              <div
                className={`${
                  corners !== 'rounded-full' ? corners : 'rounded-3xl'
                } dark:bg-dark-900 ${cardsStyle} dark:border-dark-700 p-6`}
              >
                <div className='flex justify-between align-center'>
                  <div>
                    <div className='text-lg leading-tight   text-gray-500 dark:text-gray-400'>
                      Employees
                    </div>
                    <div className='text-3xl leading-tight font-semibold'>
                      {employees}
                    </div>
                  </div>
                  <div>
                    <BaseIcon
                      className={`${iconsColor}`}
                      w='w-16'
                      h='h-16'
                      size={48}
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      path={
                        'mdiAccountGroup' in icon
                          ? icon['mdiAccountGroup' as keyof typeof icon]
                          : icon.mdiTable || icon.mdiTable
                      }
                    />
                  </div>
                </div>
              </div>
            </Link>
          )}

          {hasPermission(currentUser, 'READ_INVENTORY') && (
            <Link href={'/inventory/inventory-list'}>
              <div
                className={`${
                  corners !== 'rounded-full' ? corners : 'rounded-3xl'
                } dark:bg-dark-900 ${cardsStyle} dark:border-dark-700 p-6`}
              >
                <div className='flex justify-between align-center'>
                  <div>
                    <div className='text-lg leading-tight   text-gray-500 dark:text-gray-400'>
                      Inventory
                    </div>
                    <div className='text-3xl leading-tight font-semibold'>
                      {inventory}
                    </div>
                  </div>
                  <div>
                    <BaseIcon
                      className={`${iconsColor}`}
                      w='w-16'
                      h='h-16'
                      size={48}
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      path={
                        'mdiWarehouse' in icon
                          ? icon['mdiWarehouse' as keyof typeof icon]
                          : icon.mdiTable || icon.mdiTable
                      }
                    />
                  </div>
                </div>
              </div>
            </Link>
          )}

          {hasPermission(currentUser, 'READ_MACHINERY') && (
            <Link href={'/machinery/machinery-list'}>
              <div
                className={`${
                  corners !== 'rounded-full' ? corners : 'rounded-3xl'
                } dark:bg-dark-900 ${cardsStyle} dark:border-dark-700 p-6`}
              >
                <div className='flex justify-between align-center'>
                  <div>
                    <div className='text-lg leading-tight   text-gray-500 dark:text-gray-400'>
                      Machinery
                    </div>
                    <div className='text-3xl leading-tight font-semibold'>
                      {machinery}
                    </div>
                  </div>
                  <div>
                    <BaseIcon
                      className={`${iconsColor}`}
                      w='w-16'
                      h='h-16'
                      size={48}
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      path={
                        'mdiFactory' in icon
                          ? icon['mdiFactory' as keyof typeof icon]
                          : icon.mdiTable || icon.mdiTable
                      }
                    />
                  </div>
                </div>
              </div>
            </Link>
          )}

          {hasPermission(currentUser, 'READ_QUALITY_CONTROL') && (
            <Link href={'/quality_control/quality_control-list'}>
              <div
                className={`${
                  corners !== 'rounded-full' ? corners : 'rounded-3xl'
                } dark:bg-dark-900 ${cardsStyle} dark:border-dark-700 p-6`}
              >
                <div className='flex justify-between align-center'>
                  <div>
                    <div className='text-lg leading-tight   text-gray-500 dark:text-gray-400'>
                      Quality control
                    </div>
                    <div className='text-3xl leading-tight font-semibold'>
                      {quality_control}
                    </div>
                  </div>
                  <div>
                    <BaseIcon
                      className={`${iconsColor}`}
                      w='w-16'
                      h='h-16'
                      size={48}
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      path={
                        'mdiCheckCircle' in icon
                          ? icon['mdiCheckCircle' as keyof typeof icon]
                          : icon.mdiTable || icon.mdiTable
                      }
                    />
                  </div>
                </div>
              </div>
            </Link>
          )}

          {hasPermission(currentUser, 'READ_RAW_MATERIALS') && (
            <Link href={'/raw_materials/raw_materials-list'}>
              <div
                className={`${
                  corners !== 'rounded-full' ? corners : 'rounded-3xl'
                } dark:bg-dark-900 ${cardsStyle} dark:border-dark-700 p-6`}
              >
                <div className='flex justify-between align-center'>
                  <div>
                    <div className='text-lg leading-tight   text-gray-500 dark:text-gray-400'>
                      Raw materials
                    </div>
                    <div className='text-3xl leading-tight font-semibold'>
                      {raw_materials}
                    </div>
                  </div>
                  <div>
                    <BaseIcon
                      className={`${iconsColor}`}
                      w='w-16'
                      h='h-16'
                      size={48}
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      path={
                        'mdiPackageVariant' in icon
                          ? icon['mdiPackageVariant' as keyof typeof icon]
                          : icon.mdiTable || icon.mdiTable
                      }
                    />
                  </div>
                </div>
              </div>
            </Link>
          )}

          {hasPermission(currentUser, 'READ_SUPPLIERS') && (
            <Link href={'/suppliers/suppliers-list'}>
              <div
                className={`${
                  corners !== 'rounded-full' ? corners : 'rounded-3xl'
                } dark:bg-dark-900 ${cardsStyle} dark:border-dark-700 p-6`}
              >
                <div className='flex justify-between align-center'>
                  <div>
                    <div className='text-lg leading-tight   text-gray-500 dark:text-gray-400'>
                      Suppliers
                    </div>
                    <div className='text-3xl leading-tight font-semibold'>
                      {suppliers}
                    </div>
                  </div>
                  <div>
                    <BaseIcon
                      className={`${iconsColor}`}
                      w='w-16'
                      h='h-16'
                      size={48}
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      path={
                        'mdiTruck' in icon
                          ? icon['mdiTruck' as keyof typeof icon]
                          : icon.mdiTable || icon.mdiTable
                      }
                    />
                  </div>
                </div>
              </div>
            </Link>
          )}

          {hasPermission(currentUser, 'READ_WORK_ORDERS') && (
            <Link href={'/work_orders/work_orders-list'}>
              <div
                className={`${
                  corners !== 'rounded-full' ? corners : 'rounded-3xl'
                } dark:bg-dark-900 ${cardsStyle} dark:border-dark-700 p-6`}
              >
                <div className='flex justify-between align-center'>
                  <div>
                    <div className='text-lg leading-tight   text-gray-500 dark:text-gray-400'>
                      Work orders
                    </div>
                    <div className='text-3xl leading-tight font-semibold'>
                      {work_orders}
                    </div>
                  </div>
                  <div>
                    <BaseIcon
                      className={`${iconsColor}`}
                      w='w-16'
                      h='h-16'
                      size={48}
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      path={
                        'mdiClipboardList' in icon
                          ? icon['mdiClipboardList' as keyof typeof icon]
                          : icon.mdiTable || icon.mdiTable
                      }
                    />
                  </div>
                </div>
              </div>
            </Link>
          )}

          {hasPermission(currentUser, 'READ_ROLES') && (
            <Link href={'/roles/roles-list'}>
              <div
                className={`${
                  corners !== 'rounded-full' ? corners : 'rounded-3xl'
                } dark:bg-dark-900 ${cardsStyle} dark:border-dark-700 p-6`}
              >
                <div className='flex justify-between align-center'>
                  <div>
                    <div className='text-lg leading-tight   text-gray-500 dark:text-gray-400'>
                      Roles
                    </div>
                    <div className='text-3xl leading-tight font-semibold'>
                      {roles}
                    </div>
                  </div>
                  <div>
                    <BaseIcon
                      className={`${iconsColor}`}
                      w='w-16'
                      h='h-16'
                      size={48}
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      path={
                        icon.mdiShieldAccountVariantOutline || icon.mdiTable
                      }
                    />
                  </div>
                </div>
              </div>
            </Link>
          )}

          {hasPermission(currentUser, 'READ_PERMISSIONS') && (
            <Link href={'/permissions/permissions-list'}>
              <div
                className={`${
                  corners !== 'rounded-full' ? corners : 'rounded-3xl'
                } dark:bg-dark-900 ${cardsStyle} dark:border-dark-700 p-6`}
              >
                <div className='flex justify-between align-center'>
                  <div>
                    <div className='text-lg leading-tight   text-gray-500 dark:text-gray-400'>
                      Permissions
                    </div>
                    <div className='text-3xl leading-tight font-semibold'>
                      {permissions}
                    </div>
                  </div>
                  <div>
                    <BaseIcon
                      className={`${iconsColor}`}
                      w='w-16'
                      h='h-16'
                      size={48}
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      path={icon.mdiShieldAccountOutline || icon.mdiTable}
                    />
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>
      </SectionMain>
    </>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>;
};

export default Dashboard;
