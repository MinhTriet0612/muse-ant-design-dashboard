import React, { useEffect, useReducer } from "react";
import { db } from "../service/firebase/firebase";
import { getDocs, collection } from "firebase/firestore";

export const OrderFromCustomerContext = React.createContext({
  orderFromCustomer: [],
  addOrderFromCustomer: (orderFromCustomer) => {},
  removeOrderFromCustomer: (orderFromCustomerId) => {},
  updateOrderFromCustomer: (orderFromCustomerId) => {},
  getDataFromDatabase: () => {},
});

const actions = {
  ADD_ORDER_FROM_CUSTOMER: "ADD_ORDER_FROM_CUSTOMER",
  REMOVE_ORDER_FROM_CUSTOMER: "REMOVE_ORDER_FROM_CUSTOMER",
  UPDATE_ORDER_FROM_CUSTOMER: "UPDATE_ORDER_FROM_CUSTOMER",
  GET_DATA_FROM_DATABASE: "GET_DATA_FROM_DATABASE",
};

const reducer = (state, action) => {
  switch (action.type) {
    case actions.GET_DATA_FROM_DATABASE: {
      // console.log(action.payload);
      return { ...state, orderFromCustomer: [...action.payload] };
    }
    case actions.REMOVE_ORDER_FROM_CUSTOMER: {
      const id = action.payload;
      const newOrderFromCustomer = [...state.orderFromCustomer].filter(
        (order) => order.id !== id
      );

      return { ...state, orderFromCustomer: [...newOrderFromCustomer] };
    }
    default:
      return state;
  }
};

const OrderFromCustomerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    orderFromCustomer: [],
  });

  const removeOrderFromCustomer = (id) => {
    dispatch({ type: actions.REMOVE_ORDER_FROM_CUSTOMER, payload: id });
  };

  const getDataFromDatabase = (data) => {
    dispatch({ type: actions.GET_DATA_FROM_DATABASE, payload: data });
  };

  useEffect(() => {
    const getData = async () => {
      const querySnapshot = await getDocs(collection(db, "orders"));
      const data = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      getDataFromDatabase(data);
    };
    getData();
  }, []);

  return (
    <OrderFromCustomerContext.Provider
      value={{
        orderFromCustomer: state.orderFromCustomer,
        removeOrderFromCustomer,
      }}
    >
      {children}
    </OrderFromCustomerContext.Provider>
  );
};

export default OrderFromCustomerProvider;
