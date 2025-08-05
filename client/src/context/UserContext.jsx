/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import { axiosInstance } from "../config";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [dataUserLogin, setDataUserLogin] = useState([]);
  const [detilUserLogin, setDetilUserLogin] = useState([]);

  useEffect(() => {
    getUser(); // Fetch user data saat awal
  }, []);

  useEffect(() => {
    if (user) {
      const fetchDataUser = async () => {
        try {
          const res = await axiosInstance.get(`/user/get/${user._id}`);
          setDataUserLogin(res.data);
        } catch (err) {
          console.error(err);
        }
      };

      const fetchDetilUser = async () => {
        try {
          const res = await axiosInstance.get(`/detil/get/${user._id}`);
          setDetilUserLogin(res.data);
        } catch (error) {
          console.error(error);
        }
      };

      fetchDataUser();
      fetchDetilUser();
    }
  }, [user]);

  const getUser = async () => {
    try {
      const res = await axiosInstance.get("/auth/refetch", { withCredentials: true });
      setUser(res.data);
    } catch (err) {
      if (err) {
        console.error("tidak ada user, perlu Login!");
      }
    }
  };

  return <UserContext.Provider value={{ user, setUser, dataUserLogin, setDataUserLogin, detilUserLogin, setDetilUserLogin }}>{children}</UserContext.Provider>;
}
