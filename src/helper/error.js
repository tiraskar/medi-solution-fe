export const parseApiError = (error) => {
  return (
    error.response?.data?.errorMessage ||
    error.response?.data?.error?.message ||
    error.response?.data?.message ||
    "An unknown error has occured"
  );
};
