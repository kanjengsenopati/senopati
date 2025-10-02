import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/work_orders/work_ordersSlice';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';
import LayoutAuthenticated from '../../layouts/Authenticated';
import { getPageTitle } from '../../config';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import SectionMain from '../../components/SectionMain';
import CardBox from '../../components/CardBox';
import BaseButton from '../../components/BaseButton';
import BaseDivider from '../../components/BaseDivider';
import { mdiChartTimelineVariant } from '@mdi/js';
import { SwitchField } from '../../components/SwitchField';
import FormField from '../../components/FormField';

const Work_ordersView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { work_orders } = useAppSelector((state) => state.work_orders);

  const { id } = router.query;

  function removeLastCharacter(str) {
    console.log(str, `str`);
    return str.slice(0, -1);
  }

  useEffect(() => {
    dispatch(fetch({ id }));
  }, [dispatch, id]);

  return (
    <>
      <Head>
        <title>{getPageTitle('View work_orders')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View work_orders')}
          main
        >
          <BaseButton
            color='info'
            label='Edit'
            href={`/work_orders/work_orders-edit/?id=${id}`}
          />
        </SectionTitleLineWithButton>
        <CardBox>
          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>OrderNumber</p>
            <p>{work_orders?.order_number}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>ProductionManager</p>

            <p>{work_orders?.production_manager?.firstName ?? 'No data'}</p>
          </div>

          <>
            <p className={'block font-bold mb-2'}>RawMaterials</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>

                      <th>Quantity</th>

                      <th>ReorderLevel</th>
                    </tr>
                  </thead>
                  <tbody>
                    {work_orders.raw_materials &&
                      Array.isArray(work_orders.raw_materials) &&
                      work_orders.raw_materials.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/raw_materials/raw_materials-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='name'>{item.name}</td>

                          <td data-label='quantity'>{item.quantity}</td>

                          <td data-label='reorder_level'>
                            {item.reorder_level}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!work_orders?.raw_materials?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Machinery</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>

                      <th>Model</th>

                      <th>MaintenanceSchedule</th>

                      <th>IsOperational</th>
                    </tr>
                  </thead>
                  <tbody>
                    {work_orders.machinery &&
                      Array.isArray(work_orders.machinery) &&
                      work_orders.machinery.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/machinery/machinery-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='name'>{item.name}</td>

                          <td data-label='model'>{item.model}</td>

                          <td data-label='maintenance_schedule'>
                            {dataFormatter.dateTimeFormatter(
                              item.maintenance_schedule,
                            )}
                          </td>

                          <td data-label='is_operational'>
                            {dataFormatter.booleanFormatter(
                              item.is_operational,
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!work_orders?.machinery?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <FormField label='StartDate'>
            {work_orders.start_date ? (
              <DatePicker
                dateFormat='yyyy-MM-dd hh:mm'
                showTimeSelect
                selected={
                  work_orders.start_date
                    ? new Date(
                        dayjs(work_orders.start_date).format(
                          'YYYY-MM-DD hh:mm',
                        ),
                      )
                    : null
                }
                disabled
              />
            ) : (
              <p>No StartDate</p>
            )}
          </FormField>

          <FormField label='EndDate'>
            {work_orders.end_date ? (
              <DatePicker
                dateFormat='yyyy-MM-dd hh:mm'
                showTimeSelect
                selected={
                  work_orders.end_date
                    ? new Date(
                        dayjs(work_orders.end_date).format('YYYY-MM-DD hh:mm'),
                      )
                    : null
                }
                disabled
              />
            ) : (
              <p>No EndDate</p>
            )}
          </FormField>

          <>
            <p className={'block font-bold mb-2'}>Quality_control WorkOrder</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>CheckPoint</th>

                      <th>Passed</th>

                      <th>CheckDate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {work_orders.quality_control_work_order &&
                      Array.isArray(work_orders.quality_control_work_order) &&
                      work_orders.quality_control_work_order.map(
                        (item: any) => (
                          <tr
                            key={item.id}
                            onClick={() =>
                              router.push(
                                `/quality_control/quality_control-view/?id=${item.id}`,
                              )
                            }
                          >
                            <td data-label='check_point'>{item.check_point}</td>

                            <td data-label='passed'>
                              {dataFormatter.booleanFormatter(item.passed)}
                            </td>

                            <td data-label='check_date'>
                              {dataFormatter.dateTimeFormatter(item.check_date)}
                            </td>
                          </tr>
                        ),
                      )}
                  </tbody>
                </table>
              </div>
              {!work_orders?.quality_control_work_order?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/work_orders/work_orders-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

Work_ordersView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_WORK_ORDERS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default Work_ordersView;
