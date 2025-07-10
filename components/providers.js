"use client";
import store from "@app/redux/store";
import { Provider } from "react-redux";

export function Providers({ children }) {
  return <Provider store={store}>{children}</Provider>;
}

export default Provider;