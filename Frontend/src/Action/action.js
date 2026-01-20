import {
  getRequest,
  postRequest,
  PatchRequest,
  deleteRequest,
} from "../coreFIles/helper";

//------------------|| USER AUTH ||------------------//

export const register = async (data) => {
  const res = await postRequest("auth/register", data);
  return res.data;
};


export const adminLogin = async (data) => {
  const res = await postRequest("auth/login", data);
  return res.data;
};

export const forgotPassword = async (data) => {
  const res = await postRequest("auth/forgotPassword", data);
  return res.data;
};


export const resetPassword = async (data) => {
  const res = await postRequest("auth/resetPassword", data);
  return res.data;
};


export const logout = async (data) => {
  const res = await postRequest("auth/logout", data);
  return res.data;
};


export const refreshTokenAPI = async (data) => {
  const res = await postRequest("auth/refresh-token", data);
  return res.data;
};


export const getUser = async () => {
  const res = await getRequest("users/getUser");
  return res.data;
};




