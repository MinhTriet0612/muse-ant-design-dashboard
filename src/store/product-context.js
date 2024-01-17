import React, { useReducer, useEffect } from "react";
import { setDoc, doc, getDocs, collection } from "firebase/firestore";
import { db } from "../service/firebase/firebase";
import { notification } from "antd";

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

const openNotification = (title, message) => {
  notification.open({
    message: title,
    description: message,
  });
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
        const docRef = doc(db, "products", product.key);
        setDoc(docRef, {
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
        })
          .then(() => {
            openNotification("Thêm thành công", "");
          })
          .catch((error) => {
            openNotification(
              "Thêm thất bại",
              "Mời bạn reload lại page để thêm"
            );
          });

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
      const docRef = doc(db, "products", product.key);
      setDoc(docRef, {
        products: newProducts[indexObj].products,
      }).then(() => {
        openNotification("Thêm thành công", "");
      });

      return { ...state, products: [...newProducts] };
    }

    case actions.REMOVE_PRODUCT: {
      // console.log(action.payload);
      const productId = action.payload;
      const newProducts = [...state.products];
      const indexObj = newProducts.findIndex((item) => {
        return item.products.some((product) => product.id === productId);
      });
      const newProductsAfterRemove = newProducts.map((item) => {
        return {
          key: item.key,
          products: item.products.filter((product) => product.id !== productId),
        };
      });

      // console.log(newProductsAfterRemove);
      const docRef = doc(db, "products", newProducts[indexObj].key);
      setDoc(docRef, {
        products: newProductsAfterRemove[indexObj].products,
      }).then(() => {
        openNotification("Xóa thành công", "");
      });

      return { ...state, products: [...newProductsAfterRemove] };
    }

    case actions.UPDATE_PRODUCT: {
      console.log(action.payload);
      const product = { ...action.payload };
      const newProducts = [...state.products];
      const indexObj = newProducts.findIndex(
        (item) => item.key === product.key
      );
      const indexProduct = newProducts[indexObj].products.findIndex(
        (item) => item.id === product.id
      );
      newProducts[indexObj].products[indexProduct] = {
        id: product.id,
        brand: product.brand,
        discountPercentage: product.discountPercentage,
        title: product.title,
        thumbnail: product.thumbnail,
        price: product.price,
        description: product.description,
      };
      console.log(newProducts[indexObj]);
      const docRef = doc(db, "products", product.key);
      setDoc(docRef, {
        products: newProducts[indexObj].products,
      })
        .then(() => {
          openNotification("Cập nhật thành công", "");
        })
        .catch((error) => {
          openNotification(
            "Cập nhật thất bại",
            "Mời bạn reload lại page để cập nhật"
          );
        });
      return { ...state, products: [...newProducts] };
    }

    case actions.GET_DATA_FROM_DATABASE: {
      return { ...state, products: action.payload };
    }

    default: {
      return state;
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
          products: doc.data().products || [],
        };
      });
      // console.log(data);
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

  const updateProduct = (product) => {
    dispatch({
      type: actions.UPDATE_PRODUCT,
      payload: { ...product },
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
