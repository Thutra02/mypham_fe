import api from "../api/api";

const uploadImages = async (formData: FormData): Promise<string[]> => {
  const response = await api.post("/api/uploads/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  const url = response.data.data.map((item: string) => {
    return api.defaults.baseURL + "/api" + item;
  });
  return url;
};

const uploadImage = async (formData: FormData): Promise<string> => {
  const response = await api.post("/api/uploads/file", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data;
};

export { uploadImage, uploadImages };

