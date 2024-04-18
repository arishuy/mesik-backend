import admin from "./admin.js";
import income from "./income.js";
import expertIncome from "./expertIncome.js";
import expert from "./expert.js";

export default {
  "/statistics/admin": {
    ...admin,
  },
  "/statistics/current-expert": {
    ...expert,
  },
  "/statistics/income": {
    ...income,
  },
  "/statistics/current-expert-income": {
    ...expertIncome,
  },
};
