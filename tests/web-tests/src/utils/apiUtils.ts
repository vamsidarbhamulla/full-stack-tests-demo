import { APIRequestContext, expect } from '@playwright/test';
import { randEmail } from '@ngneat/falso';
import { NewUserResponseBody } from '@models/newUserResponseBody';

export async function createAccountApi(apiContext: APIRequestContext, email?: string): Promise<NewUserResponseBody> {
  const password = process.env.DEFAULT_PASSWORD!;
  const securityAnswer = process.env.DEFAULT_SECURITY_ANSWER ?? 'tester';
  const dateTime = `${new Date().toISOString().split('T')[0]}T19:04:13.448Z`;
  const securityQuestionId = 2;
  const emailId: string = email ?? randEmail();
  const data = {
    email: emailId,
    password,
    passwordRepeat: password,
    securityQuestion: {
      id: securityQuestionId,
      question: "Mother's maiden name?",
      createdAt: dateTime,
      updatedAt: dateTime,
    },
    securityAnswer,
  };
  const newUserResponse = await apiContext.post(`/api/Users/`, {
    data,
  });
  expect(newUserResponse.ok()).toBeTruthy();

  const userBody: NewUserResponseBody = await newUserResponse.json();
  const id = userBody.data.id;

  const newSecurityAnswer = await apiContext.post(`/api/SecurityAnswers/`, {
    data: {
      UserId: id,
      answer: securityAnswer,
      SecurityQuestionId: securityQuestionId,
    },
  });
  expect(newSecurityAnswer.ok()).toBeTruthy();

  console.log('request body', data);
  console.log('response body:', userBody);
  return userBody;
}
