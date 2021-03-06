export enum Tasks {
  Acct_Export = 'Acct_Export',
  Acct_GL = 'Acct_GL',
  Acct_Log = 'Acct_Log',
  Acct_Maint = 'Acct_Maint',
  Acct_Week = 'Acct_Week',
  Appt_ApptBook = 'Appt_ApptBook',
  Appt_BlockTypes = 'Appt_BlockTypes',
  Appt_Cancel = 'Appt_Cancel',
  Appt_CancelBlock = 'Appt_CancelBlock',
  Appt_CancelNoShow = 'Appt_CancelNoShow',
  Appt_Cancellation = 'Appt_Cancellation',
  Appt_Confirmation = 'Appt_Confirmation',
  Appt_DragBlock = 'Appt_DragBlock',
  Appt_DragDrop = 'Appt_DragDrop',
  Appt_EnterAppt = 'Appt_EnterAppt',
  Appt_EnterBlock = 'Appt_EnterBlock',
  Appt_EnterStanding = 'Appt_EnterStanding',
  Appt_MissingFormulas = 'Appt_MissingFormulas',
  Appt_ModifyAppt = 'Appt_ModifyAppt',
  Appt_ModifyBlock = 'Appt_ModifyBlock',
  Appt_MultiServiceAppt = 'Appt_MultiServiceAppt',
  Appt_OverdueClients = 'Appt_OverdueClients',
  Appt_Override = 'Appt_Override',
  Appt_QuickAppt = 'Appt_QuickAppt',
  Appt_ReviewRequest = 'Appt_ReviewRequest',
  Appt_SetupServicePkg = 'Appt_SetupServicePkg',
  Appt_SwitchStore = 'Appt_SwitchStore',
  Appt_ViewContactInfo = 'Appt_ViewContactInfo',
  Appt_ViewServicePkg = 'Appt_ViewServicePkg',
  Appt_ViewStanding = 'Appt_ViewStanding',
  Clients_BadCheck = 'Clients_BadCheck',
  Clients_Browser = 'Clients_Browser',
  Clients_ClientChat = 'Clients_ClientChat',
  Clients_Delete = 'Clients_Delete',
  Clients_EditPricing = 'Clients_EditPricing',
  Clients_Info = 'Clients_Info',
  Clients_Loyalty = 'Clients_Loyalty',
  Clients_Mailing = 'Clients_Mailing',
  Clients_Maintain = 'Clients_Maintain',
  Clients_Medical = 'Clients_Medical',
  Clients_Merge = 'Clients_Merge',
  Clients_NotesAndFormulas = 'Clients_NotesAndFormulas',
  Clients_Queue = 'Clients_Queue',
  Clients_QueueNoShow = 'Clients_QueueNoShow',
  Clients_QueueRemove = 'Clients_QueueRemove',
  Daily_Announce = 'Daily_Announce',
  Daily_Balance = 'Daily_Balance',
  Daily_CCLog = 'Daily_CCLog',
  Daily_CancelMembership = 'Daily_CancelMembership',
  Daily_CancelMembershipEarly = 'Daily_CancelMembershipEarly',
  Daily_CancelMembershipOverrideFee = 'Daily_CancelMembershipOverrideFee',
  Daily_CashDrop = 'Daily_CashDrop',
  Daily_DeleteExpGift = 'Daily_DeleteExpGift',
  Daily_DeleteGift = 'Daily_DeleteGift',
  Daily_EndDay = 'Daily_EndDay',
  Daily_EnterPaidOut = 'Daily_EnterPaidOut',
  Daily_EnterSales = 'Daily_EnterSales',
  Daily_GiftCerts = 'Daily_GiftCerts',
  Daily_MailGiftCards = 'Daily_MailGiftCards',
  Daily_MemberList = 'Daily_MemberList',
  Daily_MembershipBills = 'Daily_MembershipBills',
  Daily_MembershipWaiveCharges = 'Daily_MembershipWaiveCharges',
  Daily_MissedSale = 'Daily_MissedSale',
  Daily_ModifyGift = 'Daily_ModifyGift',
  Daily_PayOnAccount = 'Daily_PayOnAccount',
  Daily_RemovePaidOut = 'Daily_RemovePaidOut',
  Daily_ScheduleRequests = 'Daily_ScheduleRequests',
  Daily_ScheduleRequestsOther = 'Daily_ScheduleRequestsOther',
  Daily_ShiftReports = 'Daily_ShiftReports',
  Daily_TimeClock = 'Daily_TimeClock',
  Daily_TimeClockCanSwitchEmployees = 'Daily_TimeClockCanSwitchEmployees',
  Daily_TimeClockCanUseOtherTimeTypes = 'Daily_TimeClockCanUseOtherTimeTypes',
  Daily_ViewClientContactInformation = 'Daily_ViewClientContactInformation',
  Daily_ViewSales = 'Daily_ViewSales',
  Daily_ViewSalesOther = 'Daily_ViewSalesOther',
  Daily_VoidChange = 'Daily_VoidChange',
  Daily_WorkTicket = 'Daily_WorkTicket',
  File_CreditCard = 'File_CreditCard',
  File_DatabaseSetup = 'File_DatabaseSetup',
  File_Exit = 'File_Exit',
  File_SystemConfig = 'File_SystemConfig',
  Loyalty_Adjust = 'Loyalty_Adjust',
  Loyalty_Levels = 'Loyalty_Levels',
  Loyalty_Retail = 'Loyalty_Retail',
  Market_Dashboard = 'Market_Dashboard',
  Market_LastMinute = 'Market_LastMinute',
  Market_ReferGC = 'Market_ReferGC',
  Market_Rewards = 'Market_Rewards',
  MobileWeb_ProviderView = 'MobileWeb_ProviderView',
  Mobile_Manager = 'Mobile_Manager',
  Mobile_Scorecard = 'Mobile_Scorecard',
  Mobile_PosApp = 'Mobile_PosApp',  // Mobile App - POS App??? => ability to use new app at all
  Mobile_Appointments = 'Mobile_Appointments', // ???Mobile App - My Appointment Book??? => ability to access own appointments in app
  Mobile_FullAppointments = 'Mobile_FullAppointments', // ???Mobile App - Full Appointment Book??? => ability to access entire appointment book in app
  Pay_BonusWorksheet = 'Pay_BonusWorksheet',
  Pay_Gross = 'Pay_Gross',
  Pay_PayStubs = 'Pay_PayStubs',
  Pay_PayStubs_Manager = 'Pay_PayStubs_Manager',
  Pay_ScheduleRequests = 'Pay_ScheduleRequests',
  Pay_Setup = 'Pay_Setup',
  Pay_SpecialPay = 'Pay_SpecialPay',
  Pay_TimeCard = 'Pay_TimeCard',
  Pay_WeeklySchedule = 'Pay_WeeklySchedule',
  Product_Adjustment = 'Product_Adjustment',
  Product_BackBar = 'Product_BackBar',
  Product_Count = 'Product_Count',
  Product_CreatePO = 'Product_CreatePO',
  Product_EditLines = 'Product_EditLines',
  Product_EnterPurchases = 'Product_EnterPurchases',
  Product_PriceLabel = 'Product_PriceLabel',
  Product_ReceivePO = 'Product_ReceivePO',
  Product_RetailDiscount = 'Product_RetailDiscount',
  Report_Appt_ConfList = 'Report_Appt_ConfList',
  Report_Appt_Forecast = 'Report_Appt_Forecast',
  Report_Appt_MultiClient = 'Report_Appt_MultiClient',
  Report_Appt_StylistApptList = 'Report_Appt_StylistApptList',
  Report_Appt_StylistDailySchedule = 'Report_Appt_StylistDailySchedule',
  Report_Apt_AppAudit = 'Report_Apt_AppAudit',
  Report_BMI_DailyWeekly = 'Report_BMI_DailyWeekly',
  Report_BMI_MonthlySales = 'Report_BMI_MonthlySales',
  Report_BMI_SalonCoverage = 'Report_BMI_SalonCoverage',
  Report_BMI_StylistTicket = 'Report_BMI_StylistTicket',
  Report_CD_Balanced = 'Report_CD_Balanced',
  Report_CD_Detailed = 'Report_CD_Detailed',
  Report_CD_ReportTradingSummary = 'Report_CD_ReportTradingSummary',
  Report_CD_Security = 'Report_CD_Security',
  Report_Client_AcctDetail = 'Report_Client_AcctDetail',
  Report_Client_Cancel_No_Show = 'Report_Client_Cancel_No_Show',
  Report_Client_Excitement = 'Report_Client_Excitement',
  Report_Client_FirstTime = 'Report_Client_FirstTime',
  Report_Client_Loyalty = 'Report_Client_Loyalty',
  Report_Client_Pricing = 'Report_Client_Pricing',
  Report_Client_Rebooking = 'Report_Client_Rebooking',
  Report_Client_RefAnalysis = 'Report_Client_RefAnalysis',
  Report_Client_ReferenceList = 'Report_Client_ReferenceList',
  Report_Client_Removed = 'Report_Client_Removed',
  Report_Client_Retention = 'Report_Client_Retention',
  Report_Client_Stat = 'Report_Client_Stat',
  Report_Digital_Doctor = 'Report_Digital_Doctor',
  Report_Digital_Doctor_Lite = 'Report_Digital_Doctor_Lite',
  Report_EmpHours = 'Report_EmpHours',
  Report_EmpHoursSummary = 'Report_EmpHoursSummary',
  Report_Emp_DetailTally = 'Report_Emp_DetailTally',
  Report_Emp_Efficiency = 'Report_Emp_Efficiency',
  Report_Emp_NotClocked = 'Report_Emp_NotClocked',
  Report_Emp_PayrollSumm = 'Report_Emp_PayrollSumm',
  Report_Emp_Prod_Sales = 'Report_Emp_Prod_Sales',
  Report_Emp_ReceptionistTxns = 'Report_Emp_ReceptionistTxns',
  Report_Emp_SalesAnalysis = 'Report_Emp_SalesAnalysis',
  Report_Emp_ServDetail = 'Report_Emp_ServDetail',
  Report_Emp_ServiceTimes = 'Report_Emp_ServiceTimes',
  Report_Emp_StyCmp = 'Report_Emp_StyCmp',
  Report_Emp_StylistAnalysis = 'Report_Emp_StylistAnalysis',
  Report_Emp_StylistDetailReq = 'Report_Emp_StylistDetailReq',
  Report_Emp_StylistTracking = 'Report_Emp_StylistTracking',
  Report_Emp_SumTally = 'Report_Emp_SumTally',
  Report_Emp_TimeCard = 'Report_Emp_TimeCard',
  Report_Emp_TimeClockEx = 'Report_Emp_TimeClockEx',
  Report_Emp_TimeOff = 'Report_Emp_TimeOff',
  Report_Emp_TimeOffAudit = 'Report_Emp_TimeOffAudit',
  Report_Emp_Tips = 'Report_Emp_Tips',
  Report_Emp_TipsByEmp = 'Report_Emp_TipsByEmp',
  Report_Emp_VacOutSick = 'Report_Emp_VacOutSick',
  Report_Emp_WeeklyTimeSheet = 'Report_Emp_WeeklyTimeSheet',
  Report_Employee_RetailSalesProvider = 'Report_Employee_RetailSalesProvider',
  Report_Employee_ServiceSalesProvider = 'Report_Employee_ServiceSalesProvider',
  Report_Employee_StarLevel = 'Report_Employee_StarLevel',
  Report_GC_Aging = 'Report_GC_Aging',
  Report_GC_Outst = 'Report_GC_Outst',
  Report_GC_Redeemed = 'Report_GC_Redeemed',
  Report_GC_Sold = 'Report_GC_Sold',
  Report_Hours_Forecast = 'Report_Hours_Forecast',
  Report_Inv_Adj = 'Report_Inv_Adj',
  Report_Inv_BBar = 'Report_Inv_BBar',
  Report_Inv_Daily = 'Report_Inv_Daily',
  Report_Inv_Fast = 'Report_Inv_Fast',
  Report_Inv_History = 'Report_Inv_History',
  Report_Inv_LineSales = 'Report_Inv_LineSales',
  Report_Inv_LineSalesComparison = 'Report_Inv_LineSalesComparison',
  Report_Inv_Max = 'Report_Inv_Max',
  Report_Inv_POStock_Received = 'Report_Inv_POStock_Received',
  Report_Inv_PhInvStat = 'Report_Inv_PhInvStat',
  Report_Inv_PurchOrderDetail = 'Report_Inv_PurchOrderDetail',
  Report_Inv_PurchaseOrders = 'Report_Inv_PurchaseOrders',
  Report_Inv_RSTrend = 'Report_Inv_RSTrend',
  Report_Inv_RetSA = 'Report_Inv_RetSA',
  Report_Inv_Returns = 'Report_Inv_Returns',
  Report_Inv_SPOrder = 'Report_Inv_SPOrder',
  Report_Inv_Slow = 'Report_Inv_Slow',
  Report_Inv_StProduct = 'Report_Inv_StProduct',
  Report_Inv_StatDet = 'Report_Inv_StatDet',
  Report_Inv_StatPL = 'Report_Inv_StatPL',
  Report_Inv_StatSupp = 'Report_Inv_StatSupp',
  Report_Inv_StockHand = 'Report_Inv_StockHand',
  Report_Inv_StockReceived = 'Report_Inv_StockReceived',
  Report_Loyalty_Balance = 'Report_Loyalty_Balance',
  Report_Loyalty_Redeemed = 'Report_Loyalty_Redeemed',
  Report_Mark_ClientDemo = 'Report_Mark_ClientDemo',
  Report_Mark_DiscReason = 'Report_Mark_DiscReason',
  Report_Mark_Promo = 'Report_Mark_Promo',
  Report_Mark_PromoUsage = 'Report_Mark_PromoUsage',
  Report_Marketing_ReportCouponAnalysis = 'Report_Marketing_ReportCouponAnalysis',
  Report_Marketing_ReportDiscountReason = 'Report_Marketing_ReportDiscountReason',
  Report_Monthly_Business_Record = 'Report_Monthly_Business_Record',
  Report_New_BMIColorContestByEmployee = 'Report_New_BMIColorContestByEmployee',
  Report_New_BMIColorContestByRegion = 'Report_New_BMIColorContestByRegion',
  Report_New_BMIColorContestByStore = 'Report_New_BMIColorContestByStore',
  Report_New_BMIColorContestTopEmployees = 'Report_New_BMIColorContestTopEmployees',
  Report_New_BMICombo = 'Report_New_BMICombo',
  Report_New_BMIDemographics = 'Report_New_BMIDemographics',
  Report_New_BMIDiscount = 'Report_New_BMIDiscount',
  Report_New_BMIDiscountDetail = 'Report_New_BMIDiscountDetail',
  Report_New_BMILaborAnalysis = 'Report_New_BMILaborAnalysis',
  Report_New_BMIPresidentAward = 'Report_New_BMIPresidentAward',
  Report_New_BMIRetail = 'Report_New_BMIRetail',
  Report_New_BMIRetailOnly = 'Report_New_BMIRetailOnly',
  Report_New_BMISIP = 'Report_New_BMISIP',
  Report_New_BMISalesCustomer = 'Report_New_BMISalesCustomer',
  Report_New_BMISalesHours = 'Report_New_BMISalesHours',
  Report_New_BMIService = 'Report_New_BMIService',
  Report_New_BMITimeSheet = 'Report_New_BMITimeSheet',
  Report_New_Clients = 'Report_New_Clients',
  Report_Payroll_CCPayroll = 'Report_Payroll_CCPayroll',
  Report_Payroll_Payroll = 'Report_Payroll_Payroll',
  Report_ReportViewer = 'Report_ReportViewer',
  Report_Sales_AccountPay = 'Report_Sales_AccountPay',
  Report_Sales_ActSummary = 'Report_Sales_ActSummary',
  Report_Sales_CashSalesSum = 'Report_Sales_CashSalesSum',
  Report_Sales_ChangedTransactions = 'Report_Sales_ChangedTransactions',
  Report_Sales_Cockpit = 'Report_Sales_Cockpit',
  Report_Sales_DailySalesSum = 'Report_Sales_DailySalesSum',
  Report_Sales_DeletedTransactions = 'Report_Sales_DeletedTransactions',
  Report_Sales_DeptAnalys = 'Report_Sales_DeptAnalys',
  Report_Sales_DiskTracking = 'Report_Sales_DiskTracking',
  Report_Sales_Donations = 'Report_Sales_Donations',
  Report_Sales_Downticket = 'Report_Sales_Downticket',
  Report_Sales_HourlySales = 'Report_Sales_HourlySales',
  Report_Sales_KioskStat = 'Report_Sales_KioskStat',
  Report_Sales_LossPrevention = 'Report_Sales_LossPrevention',
  Report_Sales_MembershipSold = 'Report_Sales_MembershipSold',
  Report_Sales_Outstanding_Series = 'Report_Sales_Outstanding_Series',
  Report_Sales_Overview = 'Report_Sales_Overview',
  Report_Sales_PaidOuts = 'Report_Sales_PaidOuts',
  Report_Sales_PastDueMembership = 'Report_Sales_PastDueMembership',
  Report_Sales_ProductSales = 'Report_Sales_ProductSales',
  Report_Sales_ProfitAndLoss = 'Report_Sales_ProfitAndLoss',
  Report_Sales_ReportFrequencyVisitAnalysis = 'Report_Sales_ReportFrequencyVisitAnalysis',
  Report_Sales_ReportSCHourlyLoad = 'Report_Sales_ReportSCHourlyLoad',
  Report_Sales_ReportStoreAnalysis = 'Report_Sales_ReportStoreAnalysis',
  Report_Sales_ReportStrategies = 'Report_Sales_ReportStrategies',
  Report_Sales_ReportTaxes = 'Report_Sales_ReportTaxes',
  Report_Sales_ReportVisitDeletionAudit = 'Report_Sales_ReportVisitDeletionAudit',
  Report_Sales_RetailAnalysis = 'Report_Sales_RetailAnalysis',
  Report_Sales_RetailByProduct = 'Report_Sales_RetailByProduct',
  Report_Sales_RetailHistByDate = 'Report_Sales_RetailHistByDate',
  Report_Sales_SalonActTrend = 'Report_Sales_SalonActTrend',
  Report_Sales_SalonSummarySheet = 'Report_Sales_SalonSummarySheet',
  Report_Sales_ServiceHistory = 'Report_Sales_ServiceHistory',
  Report_Sales_TicketReport = 'Report_Sales_TicketReport',
  Report_Sales_TopClients = 'Report_Sales_TopClients',
  Report_Sales_TransDetail = 'Report_Sales_TransDetail',
  Report_Sales_TransEscape = 'Report_Sales_TransEscape',
  Report_Sales_TxnVolume = 'Report_Sales_TxnVolume',
  Report_Sales_Upsell = 'Report_Sales_Upsell',
  Report_Sales_VoidChanges = 'Report_Sales_VoidChanges',
  Report_Sales_WSA = 'Report_Sales_WSA',
  Report_Sales_WeeklyRecap = 'Report_Sales_WeeklyRecap',
  Report_Sales_YearAtGlance = 'Report_Sales_YearAtGlance',
  Report_Series_Outstanding = 'Report_Series_Outstanding',
  Report_Series_Redeemed = 'Report_Series_Redeemed',
  Report_Serv_ClientsWithService = 'Report_Serv_ClientsWithService',
  Report_Serv_DetailedService = 'Report_Serv_DetailedService',
  Report_Serv_Productivity = 'Report_Serv_Productivity',
  Report_Serv_TimeAnalysis = 'Report_Serv_TimeAnalysis',
  Report_Valet_Service = 'Report_Valet_Service',
  Salon_DiscountReasons = 'Salon_DiscountReasons',
  Salon_Donation = 'Salon_Donation',
  Salon_Employee = 'Salon_Employee',
  Salon_EmployeeDayOffAdjust = 'Salon_EmployeeDayOffAdjust',
  Salon_EmployeeEdit = 'Salon_EmployeeEdit',
  Salon_Inventory = 'Salon_Inventory',
  Salon_Inventory_Delete = 'Salon_Inventory_Delete',
  Salon_Level = 'Salon_Level',
  Salon_Membership = 'Salon_Membership',
  Salon_Package = 'Salon_Package',
  Salon_Promotion = 'Salon_Promotion',
  Salon_Resource = 'Salon_Resource',
  Salon_RoomAssign = 'Salon_RoomAssign',
  Salon_Schedules = 'Salon_Schedules',
  Salon_Service = 'Salon_Service',
  Salon_Survey = 'Salon_Survey',
  Salon_TanningMaint = 'Salon_TanningMaint',
  Salon_TanningSetup = 'Salon_TanningSetup',
  Security_EnrollFingerprints = 'Security_EnrollFingerprints',
  Security_ManageRoles = 'Security_ManageRoles',
  Security_ManageUsers = 'Security_ManageUsers',
  Security_Restrict = 'Security_Restrict',
  Security_TeamLeaderRemoteAccess = 'Security_TeamLeaderRemoteAccess',
  Series_List = 'Series_List',
  Tool_CheckData = 'Tool_CheckData',
  Tool_EditServiceCat = 'Tool_EditServiceCat',
  Tool_GoalSetup = 'Tool_GoalSetup',
  Tool_ManageDrawer = 'Tool_ManageDrawer',
  Tool_Message = 'Tool_Message',
  Tool_Notes = 'Tool_Notes',
  Tool_OpenDrawer = 'Tool_OpenDrawer',
  Tool_Password = 'Tool_Password',
  Tool_RecurringReports = 'Tool_RecurringReports',
  Tool_Reminder = 'Tool_Reminder',
  Tool_SecurityLog = 'Tool_SecurityLog',
  Tool_TwillioSetup = 'Tool_TwillioSetup',
  Tool_Undelete = 'Tool_Undelete',
  Tool_WeekGoal = 'Tool_WeekGoal',
}

export enum AccessState {
  Loading = 0,
  Allowed = 1,
  AllowedWithRelogin = 2,
  Denied = 3,
}
