function assertEnvVarPresent(
  value: string | undefined,
  envName: string,
): string {
  if (value == null) {
    console.log('env:', process.env.NODE_ENV);
    throw new Error(
      `Required environment variable missing on init: ${envName}`,
    );
  }
  // toString is to guard against pure number environment variables
  return value.toString();
}

export const MONGO_URL = assertEnvVarPresent(
  process.env.MONGO_URL,
  'MONGO_URL',
);

export const RABBITMQ_URL = assertEnvVarPresent(
  process.env.RABBITMQ_URL,
  'RABBITMQ_URL',
);
