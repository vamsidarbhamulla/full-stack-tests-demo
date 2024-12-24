declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TEST_ENV: string;
      BASE_URL: string;
      DEFAULT_EMAIL: string;
      DEFAULT_PASSWORD: string;
      DEFAULT_USERNAME: string;
      SECURITY_ANSWER: string;
      NODE_ENV: 'development' | 'production';
      PORT?: string;
      PWD: string;
    }
  }
}

export {};