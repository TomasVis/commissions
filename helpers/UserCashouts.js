import moment from 'moment';

const DATE_FORMAT = "YYYYMMDD";

export default class UserCashOuts {

    getUserCashOuts  (user, date) {
     const week = moment(date, DATE_FORMAT).isoWeek();
     const year = moment(date, DATE_FORMAT).year();
     if (!this[user]) {
       return 0;
     } else if (!this[user][year]) {
       return 0;
     } else if (!this[user][year][week]) {
       return 0;
     } else return this[user][year][week];
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
 