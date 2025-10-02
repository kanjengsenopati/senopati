import { mdiChartTimelineVariant, mdiUpload } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';

import CardBox from '../../components/CardBox';
import LayoutAuthenticated from '../../layouts/Authenticated';
import SectionMain from '../../components/SectionMain';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import { getPageTitle } from '../../config';

import { Field, Form, Formik } from 'formik';
import FormField from '../../components/FormField';
import BaseDivider from '../../components/BaseDivider';
import BaseButtons from '../../components/BaseButtons';
import BaseButton from '../../components/BaseButton';
import FormCheckRadio from '../../components/FormCheckRadio';
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup';
import FormFilePicker from '../../components/FormFilePicker';
import FormImagePicker from '../../components/FormImagePicker';
import { SelectField } from '../../components/SelectField';
import { SelectFieldMany } from '../../components/SelectFieldMany';
import { SwitchField } from '../../components/SwitchField';
import { RichTextField } from '../../components/RichTextField';

import {
  update,
  fetch,
} from '../../stores/quality_control/quality_controlSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

const EditQuality_control = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    check_point: '',

    work_order: null,

    passed: false,

    check_date: new Date(),
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { quality_control } = useAppSelector((state) => state.quality_control);

  const { quality_controlId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: quality_controlId }));
  }, [quality_controlId]);

  useEffect(() => {
    if (typeof quality_control === 'object') {
      setInitialValues(quality_control);
    }
  }, [quality_control]);

  useEffect(() => {
    if (typeof quality_control === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = quality_control[el]),
      );

      setInitialValues(newInitialVal);
    }
  }, [quality_control]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: quality_controlId, data }));
    await router.push('/quality_control/quality_control-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit quality_control')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit quality_control'}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>
              <FormField label='CheckPoint'>
                <Field name='check_point' placeholder='CheckPoint' />
              </FormField>

              <FormField label='WorkOrder' labelFor='work_order'>
                <Field
                  name='work_order'
                  id='work_order'
                  component={SelectField}
                  options={initialValues.work_order}
                  itemRef={'work_orders'}
                  showField={'order_number'}
                ></Field>
              </FormField>

              <FormField label='Passed' labelFor='passed'>
                <Field
                  name='passed'
                  id='passed'
                  component={SwitchField}
                ></Field>
              </FormField>

              <FormField label='CheckDate'>
                <DatePicker
                  dateFormat='yyyy-MM-dd hh:mm'
                  showTimeSelect
                  selected={
                    initialValues.check_date
                      ? new Date(
                          dayjs(initialValues.check_date).format(
                            'YYYY-MM-DD hh:mm',
                          ),
                        )
                      : null
                  }
                  onChange={(date) =>
                    setInitialValues({ ...initialValues, check_date: date })
                  }
                />
              </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type='submit' color='info' label='Submit' />
                <BaseButton type='reset' color='info' outline label='Reset' />
                <BaseButton
                  type='reset'
                  color='danger'
                  outline
                  label='Cancel'
                  onClick={() =>
                    router.push('/quality_control/quality_control-list')
                  }
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditQuality_control.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_QUALITY_CONTROL'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditQuality_control;
