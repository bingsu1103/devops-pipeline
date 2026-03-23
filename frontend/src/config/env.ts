const ENV = {
  development: {
    API_URL: "http://localhost:7070",
  },
  staging: {
    API_URL: "http://localhost:7070",
  },
  production: {
    API_URL: "http://localhost:7070",
  },
};

const getEnv = () => {
  // Always prefer the environment variable if defined (standard for Next.js)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (process.env.NODE_ENV === "development") {
    return {
      API_URL: apiUrl || ENV.development.API_URL,
    };
  }

  // Handle staging/production
  return {
    API_URL: apiUrl || ENV.production.API_URL,
  };
};

export const config = getEnv();
export default config;
