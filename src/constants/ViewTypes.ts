export default {
  providers: { // slectedfilter vlaue
    all: 'employee.id', // if selected provider === all
    day: 'date', // picker mode value use this when selectedProvider !== all
    week: 'date', // picker mode value use this when selectedProvider !== all
  },
  deskStaff: 'employee.id', // slectedfilter vlaue
  rooms: (item) => item.room && `${item.room.id}_${item.roomOrdinal}`,
  resources: 'resource.id', // slectedfilter vlaue
};
