import React, { useReducer, useEffect } from "react";
import {
  deleteDoc,
  setDoc,
  doc,
  getDocs,
  collection,
} from "firebase/firestore";
import { db } from "../service/firebase/firebase";

const ProductContext = React.createContext({
  products: [],
  addProduct: (product) => {},
  removeProduct: (productId, productBrand) => {},
  updateProduct: (productId, productBrand) => {},
});

const actions = {
  ADD_PRODUCT: "ADD_PRODUCT",
  REMOVE_PRODUCT: "REMOVE_PRODUCT",
  UPDATE_PRODUCT: "UPDATE_PRODUCT",
  GET_DATA_FROM_DATABASE: "GET_DATA_FROM_DATABASE",
};

const reducer = (state, action) => {
  switch (action.type) {
    case actions.ADD_PRODUCT: {
      const product = { ...action.payload };
      const indexObj = state.products.findIndex(
        (item) => item.key === product.key
      );
      const newProducts = [...state.products];

      if (indexObj === -1) {
        newProducts.push({
          key: product.key,
          products: [
            {
              id: product.id,
              brand: product.brand,
              discountPercentage: product.discountPercentage,
              title: product.title,
              thumbnail: product.thumbnail,
              price: product.price,
              description: product.description,
            },
          ],
        });
        // const docRef = doc(db, "products", product.key);
        // setDoc(docRef, {
        //   products: [
        //     {
        //       id: product.id,
        //       brand: product.brand,
        //       discountPercentage: product.discountPercentage,
        //       title: product.title,
        //       thumbnail: product.thumbnail,
        //       price: product.price,
        //       description: product.description,
        //     },
        //   ],
        // });
        return { ...state, products: [...newProducts] };
      }
      newProducts[indexObj].products.push({
        id: product.id,
        brand: product.brand,
        discountPercentage: product.discountPercentage,
        title: product.title,
        thumbnail: product.thumbnail,
        price: product.price,
        description: product.description,
      });
      // const docRef = doc(db, "products", product.key);
      // setDoc(docRef, {
      //   products: newProducts[indexObj].products,
      // });
      return { ...state, products: [...newProducts] };
    }

    case actions.REMOVE_PRODUCT: {
      console.log(action.payload);
      const productId = action.payload;
      const newProducts = [...state.products];
      const newProductsAfterRemove = newProducts.map((item) => {
        return {
          key: item.key,
          products: item.products.filter((product) => product.id !== productId),
        };
      });

      console.log(newProductsAfterRemove);
      return { ...state, products: [...newProductsAfterRemove] };
    }
    case actions.UPDATE_PRODUCT: {
      return;
    }
    case actions.GET_DATA_FROM_DATABASE: {
      return { ...state, products: action.payload };
    }
  }
};

const ProductProvider = ({ children }) => {
  useEffect(() => {
    const getData = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const data = querySnapshot.docs.map((doc) => {
        return {
          key: doc.id,
          products: doc.data().products,
        };
      });
      getDataFromDatabase(data);
    };
    getData();
  }, []);
  const [state, dispatch] = useReducer(reducer, {
    products: [],
  });

  const addProduct = (product) => {
    dispatch({ type: actions.ADD_PRODUCT, payload: product });
  };

  const removeProduct = (productId) => {
    dispatch({
      type: actions.REMOVE_PRODUCT,
      payload: productId,
    });
  };

  const updateProduct = (productId, productBrand) => {
    dispatch({
      type: actions.UPDATE_PRODUCT,
      payload: { productId, productBrand },
    });
  };

  const getDataFromDatabase = (products) => {
    dispatch({
      type: actions.GET_DATA_FROM_DATABASE,
      payload: products,
    });
  };

  return (
    <ProductContext.Provider
      value={{
        products: state.products,
        addProduct: addProduct,
        removeProduct: removeProduct,
        updateProduct: updateProduct,
        getDataFromDatabase: getDataFromDatabase,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;
export { ProductContext };
