import Joi from "joi";

export function gameCreateValidation(data) {
  const schema = Joi.object({
    name: Joi.string()
      .required()
      .messages({ "string.empty": "請填入比賽名稱" }),
    short_description: Joi.string()
      .required()
      .messages({ "string.empty": "請填入簡短描述" }),
    long_description: Joi.string()
      .required()
      .messages({ "string.empty": "請填入詳細描述" }),
    date_start: Joi.date().required().greater(Date.now()).messages({
      "date.base": "請填入比賽開始日期",
      "date.empty": "請填入比賽開始日期",
      "date.greater": "比賽開始日期至少為明天",
    }),
    date_end: Joi.date().required().greater(Date.now()).messages({
      "date.base": "請填入比賽結束日期",
      "date.empty": "請填入比賽結束日期",
      "date.greater": "比賽結束日期至少為明天",
    }),
    game_winners: Joi.string()
      .required()
      .messages({ "string.empty": "請填入獲獎人數" }),
    game_award: Joi.string()
      .required()
      .messages({ "string.empty": "請填入獎品" }),
    ad_location_id: Joi.string()
      .required()
      .messages({ "string.empty": "請填入廣告ID" }),
    ad_start_date: Joi.date().required().greater(Date.now()).messages({
      "date.base": "請填入廣告開始日期",
      "date.empty": "請填入廣告開始日期",
      "date.greater": "廣告開始日期至少為明天",
    }),
    game_wallrooms_id: Joi.string().required(),
    main_image: Joi.any(),
    second_image: Joi.any(),
    advertise_image: Joi.any(),
  });
  return schema.validate(data);
}

export function betaCreateValidation(data) {
  const schema = Joi.object({
    roomNumericId: Joi.string().required(),
    userId: Joi.string().required(),
    userName: Joi.string().required(),
    comments: Joi.string()
      .required()
      .messages({ "string.empty": "Error: 請填入影片評論" }),
    levelByAuthor: Joi.string()
      .required()
      .messages({ "string.empty": "Error: 請填入體感等級" }),
    tags: Joi.array()
      .required()
      .messages({ "string.empty": "Error: 請至少填入一個tag" }),
    video: Joi.any(),
  });

  return schema.validate(data);
}

export function wallCreateValidation(data) {
  const schema = Joi.object({
    wallImage: Joi.string().required(),
    color: Joi.string().required(),
    officialLevel: Joi.string().required(),
    tags: Joi.string().required(),
    levelByAuthor: Joi.string().required(),
    gym: Joi.array().required(),
    wall: Joi.array().required(),
    wallUpdateTime: Joi.date().required(),
    wallChangeTime: Joi.date().required(),
    keepImage: Joi.boolean().required(),
    isOriginImage: Joi.boolean().required(),
  });

  return schema.validate(data);
}
