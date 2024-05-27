import Calendar from "./calendar.js";
import CalendarDay from "./calendar-day.js";
import CalendarMonth from "./calendar-month.js";
import DatePicker from "./date-picker.js";
import Time from "./time.js";

export default {
  i18n: {},
  views: {
    "uix-time": Time,
    "uix-calendar-day": CalendarDay,
    "uix-calendar-month": CalendarMonth,
    "uix-date-picker": DatePicker,
    "uix-calendar": Calendar,
  },
};
