import moment from 'moment';

const DATE_FORMAT = "YYYYMMDD";

export default class UserCashOuts {

    getUserCashOuts  (userId, date) {
     const week = moment(date, DATE_FORMAT).isoWeek();
     const year = moment(date, DATE_FORMAT).year();
     if (!this[userId]) {
       return 0;
     } else if (!this[userId][year]) {
       return 0;
     } else if (!this[userId][year][week]) {
       return 0;
     } else return this[userId][year][week];
   };
 
    setUserCashOut (userId, amount, date) {
     const week = moment(date, DATE_FORMAT).isoWeek();
     const year = moment(date, DATE_FORMAT).year();
     if (!this.getUserCashOuts(userId, date)) {
       this[userId] = {
         [year]: {
           [week]: amount,
         },
       };
     } else {
       this[userId][year][week] = this.getUserCashOuts(userId, date) + amount;
     }
   };
 }
 