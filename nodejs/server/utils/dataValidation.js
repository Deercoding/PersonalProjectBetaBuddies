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
    creator: Joi.string().required(),
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
      .messages({ "array.empty": "Error: 請至少填入一個tag" }),
    video: Joi.any(),
  });

  return schema.validate(data);
}

export function wallCreateValidation(data) {
  const schema = Joi.array().items({
    wallImage: Joi.string()
      .required()
      .messages({ "string.empty": "Error: 無牆面照片" }),
    color: Joi.string()
      .required()
      .messages({ "string.empty": "Error: 請填入牆面顏色" }),
    officialLevel: Joi.string()
      .required()
      .messages({ "string.empty": "Error: 請填入官方等級" }),
    tags: Joi.array()
      .required()
      .messages({ "array.empty": "Error: 請填入tags" }),
    gym: Joi.string()
      .required()
      .messages({ "string.empty": "Error: 請填入岩館名稱" }),
    wall: Joi.string()
      .required()
      .messages({ "string.empty": "Error: 請填入牆面名稱" }),
    wallUpdateTime: Joi.date().required().messages({
      "date.empty": "Error: 請填入更新時間",
      "date.base": "Error: 請填入正確時間格式",
    }),
    wallChangeTime: Joi.date().required().messages({
      "date.empty": "Error: 請填入換線時間",
      "date.base": "Error: 請填入正確時間格式",
    }),
    keepImage: Joi.boolean().required().messages({
      "boolean.empty": "Error: 請勾選是否使用照片",
      "boolean.base": "Error: 請勾選是否使用照片",
    }),
    isOriginImage: Joi.boolean().required(),
    creator: Joi.string().required(),
  });
  return schema.validate(data);
}

export function signupValidation(data) {
  const schema = Joi.object({
    name: Joi.string()
      .required()
      .messages({ "string.empty": "Error: 請填使用者名稱" }),
    email: Joi.string()
      .required()
      .email({ tlds: { allow: ["com", "net"] } })
      .rule({ message: "Error: 請填入有效的信箱" })
      .messages({ "string.empty": "Error: 請填信箱" }),
    password: Joi.string()
      .required()
      .messages({ "string.empty": "Error: 請填密碼" }),
  });
  return schema.validate(data);
}

export function signinValidation(data) {
  const schema = Joi.object({
    email: Joi.string()
      .required()
      .messages({ "string.empty": "Error: 請填信箱" }),
    password: Joi.string()
      .required()
      .messages({ "string.empty": "Error: 請填密碼" }),
  });
  return schema.validate(data);
}
