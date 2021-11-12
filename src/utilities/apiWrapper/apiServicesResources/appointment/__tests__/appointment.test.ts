import getAppointment from '../getAppointment';
import getAppointmentsByDate from '../getAppointmentsByDate';
import getEmployeesAppointmentOrder from '../getEmployeesAppointmentOrder';
import postAppointmentMove from '../postAppointmentMove';
import postAppointmentCancel from '../postAppointmentCancel';
import postAppointmentResize from '../postAppointmentResize';
import postEmployeesAppointmentOrder from '../postEmployeesAppointmentOrder';
import postNewAppointment from '../postNewAppointment';
import getApptAudit from '../getApptAudit';
import postCheckin from '../postCheckin';
import postAppointmentCheckout from '../postAppointmentCheckout';
import putAppointmentRemarks from '../putAppointmentRemarks';
import putAppointment from '../putAppointment';

import axios from 'axios';

const MockAdapter = require('axios-mock-adapter');
const mock = new MockAdapter(axios);
const returnData = {
  response: {
    test: 'test',
  },
};

const reqData = {
  startDate: '12-12-2018',
  endDate: '12-12-2019',
  fromDate: '12-12-2018',
  toDate: '12-12-2019',
  date: '12-12-2019',
  ids: 101,
  id: 101,
  clientId: 101,
  query: 'testmepls',
  email: 'some@postservice.net',
  zipCode: '220003',
};

mock
  // getAppointment
  .onGet(`Appointment/${reqData.id}`)
  .reply(200, returnData)
  // getAppointmentsByDate
  .onGet(`Appointment/${reqData.date}`)
  .reply(200, returnData)
  // getApptAudit
  .onGet(`Appointment/${reqData.id}/Audit`)
  .reply(200, returnData)
  // getEmployeesAppointmentOrder
  .onGet('Employees/AppointmentOrder')
  .reply(200, returnData)
  // postAppointmentCancel
  .onPost('Appointment/CancelBulk', {
    appointmentIds: reqData.ids,
    appointmentCancellation: reqData.query,
  })
  .reply(200, returnData)
  // postAppointmentCheckout
  .onPost(`Appointment/${reqData.id}/CheckOut`)
  .reply(200, returnData)
  // postAppointmentMove
  .onPost(`Appointment/${reqData.id}/Move`, reqData)
  .reply(200, returnData)
  // postAppointmentResize
  .onPost(`Appointment/${reqData.id}/Resize`, reqData)
  .reply(200, returnData)
  // postCheckin
  .onPost(`Appointment/${reqData.id}/CheckIn`)
  .reply(200, returnData)
  // postEmployeesAppointmentOrder
  .onPost('Employees/AppointmentOrder', reqData)
  .reply(200, returnData)
  // postNewAppointment
  .onPost('Appointment', reqData)
  .reply(200, returnData)
  // putAppointment
  .onPut(`Appointment/${reqData.id}`, reqData)
  .reply(200, returnData)
  // putAppointmentRemarks
  .onPut(`Appointment/${reqData.id}/Remarks`, { remarks: reqData })
  .reply(200, returnData);

describe('Appointment', () => {
  // get
  test('getZipCode should return correct property', async () => {
    const res = await getAppointment(reqData.id);
    expect(res).toEqual(returnData.response);
  });
  test('getAppointmentsByDate should return correct property', async () => {
    const res = await getAppointmentsByDate(reqData.date);
    expect(res).toEqual(returnData.response);
  });
  test('getApptAudit should return correct property', async () => {
    const res = await getApptAudit(reqData.id);
    expect(res).toEqual(returnData.response);
  });
  test('getEmployeesAppointmentOrder should return correct property', async () => {
    const res = await getEmployeesAppointmentOrder();
    expect(res).toEqual(returnData.response);
  });
  // post
  test('postAppointmentCancel should return correct property', async () => {
    const res = await postAppointmentCancel({
      appointmentIds: reqData.ids,
      appointmentCancellation: reqData.query,
    });
    expect(res).toEqual(returnData.response);
  });
  test('postAppointmentCheckout should return correct property', async () => {
    const res = await postAppointmentCheckout(reqData.id);
    expect(res).toEqual(returnData.response);
  });
  test('postAppointmentMove should return correct property', async () => {
    const res = await postAppointmentMove(reqData.id, reqData);
    expect(res).toEqual(returnData.response);
  });
  test('postAppointmentResize should return correct property', async () => {
    const res = await postAppointmentResize(reqData.id, reqData);
    expect(res).toEqual(returnData.response);
  });
  test('postCheckin should return correct property', async () => {
    const res = await postCheckin(reqData.id);
    expect(res).toEqual(returnData.response);
  });
  test('postEmployeesAppointmentOrder should return correct property', async () => {
    const res = await postEmployeesAppointmentOrder(reqData);
    expect(res).toEqual(returnData.response);
  });
  test('postNewAppointment should return correct property', async () => {
    const res = await postNewAppointment(reqData);
    expect(res).toEqual(returnData.response);
  });
  // put
  test('putAppointment should return correct property', async () => {
    const res = await putAppointment(reqData.id, reqData);
    expect(res).toEqual(returnData.response);
  });
  test('putAppointmentRemarks should return correct property', async () => {
    const res = await putAppointmentRemarks(reqData.id, reqData);
    expect(res).toEqual(returnData);
  });
});
