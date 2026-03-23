import createInstanceAxios from "@/config/axios.config";
import config from "@/config/env";

const axios = createInstanceAxios(config.API_URL);

export interface Example {
  id: number;
  name: string;
  description: string;
  version: number;
  buildCount: number;
}

const exampleApi = {
  getExamples: async () => {
    const response = await axios.get("/api/examples");
    return response.data;
  },

  getExampleById: async (id: number) => {
    const response = await axios.get(`/api/examples/${id}`);
    return response.data;
  },

  createExample: async (data: Omit<Example, "id">) => {
    const response = await axios.post("/api/examples", data);
    return response.data;
  },

  updateExample: async (id: number, data: Partial<Example>) => {
    const response = await axios.put(`/api/examples/${id}`, data);
    return response.data;
  },

  deleteExample: async (id: number) => {
    const response = await axios.delete(`/api/examples/${id}`);
    return response.data;
  },
};

export default exampleApi;
