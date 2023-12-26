import Joi from "joi";

export function gameCreateValidation(data) {
  const schema = Joi.object({
    name: Joi.string().required().max(30).messages({
      "string.empty": "請填入比賽名稱",
      "string.max": "欄位超過字數限制",
    }),
    short_description: Joi.string().required().max(30).messages({
      "string.empty": "請填入簡短描述",
      "string.max": "欄位超過字數限制",
    }),
    long_description: Joi.string().required().max(300).messages({
      "string.empty": "請填入詳細描述",
      "string.max": "欄位超過字數限制",
    }),
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
    game_winners: Joi.string().required().max(10).messages({
      "string.empty": "請填入獲獎人數",
      "string.max": "欄位超過字數限制",
    }),
    game_award: Joi.string().required().max(30).messages({
      "string.empty": "請填入獎品",
      "string.max": "欄位超過字數限制",
    }),
    ad_location_id: Joi.string().valid("1", "2").required().messages({
      "string.empty": "請填入廣告ID",
      "any.only": "廣告ID只能為 1 或是 2",
    }),
    ad_start_date: Joi.date()
      .required()
      .greater(Date.now())
      .less(Joi.ref("date_end"))
      .greater(Joi.ref("date_start"))
      .messages({
        "date.base": "請填入廣告開始日期",
        "date.empty": "請填入廣告開始日期",
        "date.less": "廣告必須在比賽日期之間",
        "date.greater": "廣告必須在比賽日期之間",
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
    comments: Joi.string().required().max(300).messages({
      "string.empty": "Error: 請填入影片評論",
      "string.max": "Error: 欄位超過字數限制",
    }),
    levelByAuthor: Joi.string().required().max(20).messages({
      "string.empty": "Error: 請填入體感等級",
      "string.max": "Error: 欄位超過字數限制",
    }),
    tags: Joi.array().items(Joi.string().max(5)).max(5).required().messages({
      "array.empty": "Error: 請至少填入一個tag",
      "array.base": "Error: 請至少填入一個tag",
      "array.max": "Error: 最多填入五個tag",
      "string.max": "Error: tag 請低於五個字",
    }),
    video: Joi.any(),
  });

  return schema.validate(data);
}

export function wallCreateValidation(data) {
  const schema = Joi.array().items({
    wallImage: Joi.string()
      .required()
      .messages({ "string.empty": "Error: 無牆面照片" }),
    color: Joi.string().required().max(30).messages({
      "string.empty": "Error: 請填入牆面顏色",
      "string.max": "Error: 欄位超過字數限制",
    }),
    officialLevel: Joi.string().required().max(20).messages({
      "string.empty": "Error: 請填入官方等級",
      "string.max": "Error: 欄位超過字數限制",
    }),
    tags: Joi.array().items(Joi.string().max(5)).max(5).required().messages({
      "array.base": "Error: 請至少填入一個tag",
      "array.empty": "Error: 請至少填入一個tag",
      "array.max": "Error: 最多填入五個tag",
      "string.max": "Error: tag 請低於五個字",
    }),
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
    wallChangeTime: Joi.date()
      .required()
      .greater(Joi.ref("wallUpdateTime"))
      .messages({
        "date.empty": "Error: 請填入換線時間",
        "date.base": "Error: 請填入正確時間格式",
        "date.greater": "換線時間需大於更新時間",
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
    name: Joi.string().required().max(30).messages({
      "string.empty": "Error: 請填使用者名稱",
      "string.max": "Error: 欄位超過字數限制",
    }),
    email: Joi.string()
      .required()
      .email({ tlds: { allow: ["com", "net"] } })
      .rule({ message: "Error: 請填入有效的信箱" })
      .max(30)
      .messages({
        "string.empty": "Error: 請填信箱",
        "string.max": "Error: 欄位超過字數限制",
      }),
    password: Joi.string().required().max(30).messages({
      "string.empty": "Error: 請填密碼",
      "string.max": "Error: 欄位超過字數限制",
    }),
  });
  return schema.validate(data);
}

export function signinValidation(data) {
  const schema = Joi.object({
    email: Joi.string().required().max(30).messages({
      "string.empty": "Error: 請填信箱",
      "string.max": "Error: 欄位超過字數限制",
    }),
    password: Joi.string().required().max(30).messages({
      "string.empty": "Error: 請填密碼",
      "string.max": "Error: 欄位超過字數限制",
    }),
  });
  return schema.validate(data);
}
