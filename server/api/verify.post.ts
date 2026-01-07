import { ObisClient } from "~~/server/utils/obis";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { studentNumber, password } = body;
  if (!studentNumber || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Введите номер студента и пароль",
    });
  }
  const obisClient = new ObisClient(studentNumber, password);
  try {
    const fullName = await obisClient.login();
    return { fullName };
  } catch (ObisClientNotLoggedInError) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Неверный номер студента или пароль",
    });
  }
})