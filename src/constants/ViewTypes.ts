export default {
  providers: { // slectedfilter vlaue
    all: 'employee.id', // if selected provider === all
    day: 'date', // picker mode value use this when selectedProvider !== all
    week: 'date', // picker mode value use this when selectedProvider !== all
  },
  deskStaff: 'employee.id', // slectedfilter vlaue
  rooms: (item) => item.room && `${item.room.id}_${item.roomOrdinal}`,
  resources: (item) => item.resource && `${item.resource.id}_${item.resourceOrdinal}`, // slectedfilter vlaue
};
