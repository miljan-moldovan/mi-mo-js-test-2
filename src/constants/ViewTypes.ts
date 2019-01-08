const dataForProvidersAndDeskStaff = {
  all: 'employee.id', // if selected provider === all
  day: 'date', // picker mode value use this when selectedProvider !== all
  week: 'date', // picker mode value use this when selectedProvider !== all
};

export default {
  providers: dataForProvidersAndDeskStaff, // slectedfilter vlaue
  deskStaff: dataForProvidersAndDeskStaff, // slectedfilter vlaue
  rooms: (item) => item.room && `${item.room.id}_${item.roomOrdinal}`,
  resources: (item) => item.resource && `${item.resource.id}_${item.resourceOrdinal}`, // slectedfilter vlaue
};
