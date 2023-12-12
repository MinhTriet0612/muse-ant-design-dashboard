import React, { useState, useRef, useEffect, useContext } from "react";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import {
  Button,
  Cascader,
  Checkbox,
  // ColorPicker,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Slider,
  Switch,
  TreeSelect,
  Upload,
  notification,
  message,
} from "antd";
import { db, storage } from "../service/firebase/firebase";
import {
  getDownloadURL,
  listAll,
  ref,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { ProductContext } from "../store/product-context";
import { getDocs, collection } from "firebase/firestore";
const { TextArea } = Input;
const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

const FormDisabledDemo = () => {
  const [per, setPerc] = useState(null);
  const nameProductRef = useRef();
  const brandRef = useRef();
  const discountRef = useRef();
  const priceRef = useRef();
  const descriptionRef = useRef("");
  const imageRef = useRef();
  const typeProductRef = useRef();
  const [componentDisabled, setComponentDisabled] = useState(false);
  const [imgUrl, setImgUrl] = useState({});
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentProducts, setCurrentProducts] = useState([]);
  const [imageUrl, setImageUrl] = useState();
  const { addProduct, products } = useContext(ProductContext);
  const { v4: uuidv4 } = require("uuid");

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      setFile(info.file);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  const handleChangeSelectTypeProduct = (value) => {
    typeProductRef.current = value;
    console.log(typeProductRef.current);
  };

  useEffect(() => {
    setCurrentProducts(
      products
        .map((subObj) => subObj.products)
        .reduce((acc, cur) => acc.concat(cur), [])
    );
  }, [products]);

  useEffect(() => {
    console.log(file);
    const uploadFile = () => {
      const name = new Date().getTime() + file.name;

      console.log(name);
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file.originFileObj);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setPerc(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImgUrl({ img: downloadURL });
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  const openNotification = (title, message) => {
    notification.open({
      message: title,
      description: message,
    });
  };

  const handleOnClickForAddProduct = () => {
    if (
      typeProductRef.current &&
      nameProductRef.current.input.value &&
      brandRef.current.input.value &&
      discountRef.current.input.value &&
      priceRef.current.input.value &&
      descriptionRef.current.resizableTextArea.textArea.value &&
      imgUrl.img &&
      !currentProducts.find(
        (products) =>
          products.title === nameProductRef.current.input.value &&
          products.thumbnail === imgUrl.img
      )
    ) {
      openNotification("Sucess", "Chỉnh sửa sản phẩm thành công ");
      addProduct({
        id: uuidv4(),
        key: typeProductRef.current,
        title: nameProductRef.current.input.value,
        brand: brandRef.current.input.value,
        discountPercentage: discountRef.current.input.value,
        price: priceRef.current.input.value,
        description: descriptionRef.current.resizableTextArea.textArea.value,
        thumbnail: imgUrl.img,
      });
      console.log({
        id: uuidv4(),
        key: typeProductRef.current,
        title: nameProductRef.current.input.value,
        brand: brandRef.current.input.value,
        discountPercentage: discountRef.current.input.value,
        price: priceRef.current.input.value,
        description: descriptionRef.current.resizableTextArea.textArea.value,
        thumbnail: imgUrl.img,
      });
    } else {
      openNotification("Failure", "Xin nhập lại thông tin");
      console.log(products);
    }
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
  };

  const actionUpload = (file) => {
    imageRef.current = file;
    console.log(imageRef.current);
  };

  return (
    <>
      <Checkbox
        checked={componentDisabled}
        onChange={(e) => setComponentDisabled(e.target.checked)}
      >
        Form disabled
      </Checkbox>
      <Form
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        disabled={componentDisabled}
        style={{
          maxWidth: 600,
        }}
      >
        <Form.Item label="Phân Loại">
          <Select
            showSearch
            placeholder="Select a person"
            optionFilterProp="children"
            onChange={handleChangeSelectTypeProduct}
            // onSearch={onSearch}
            // filterOption={filterOption}
            options={[
              {
                value: "bicycle",
                label: "Xe đạp",
              },
              {
                value: "eBike",
                label: "Xe đạp điện",
              },
              {
                value: "eMotobike",
                label: "Xe máy điện",
              },
              {
                value: "fitting",
                label: "Phụ kiện",
              },
            ]}
          />
        </Form.Item>
        <Form.Item
          label="Tên Sản Phẩm"
          rules={[
            {
              required: true,
              message: "Please input your task name!",
            },
          ]}
        >
          <Input ref={nameProductRef} />
        </Form.Item>
        <Form.Item
          label="Hãng"
          rules={[
            {
              required: true,
              message: "Please input your task name!",
            },
          ]}
        >
          <Input ref={brandRef} />
        </Form.Item>
        <Form.Item
          label="Giảm Giá"
          rules={[
            {
              required: true,
              message: "Please input your task name!",
            },
          ]}
        >
          <Input type="number" ref={discountRef} min={0} max={100} />
        </Form.Item>
        <Form.Item
          label="Giá Muốn Bán"
          rules={[
            {
              required: true,
              message: "Please input your task name!",
            },
          ]}
        >
          <Input type="number" ref={priceRef} min={0} />
        </Form.Item>
        <Form.Item
          label="Hình Ảnh"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[
            {
              required: true,
              message: "Please input your task name!",
            },
          ]}
        >
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="avatar"
                style={{
                  width: "100%",
                }}
              />
            ) : (
              uploadButton
            )}
          </Upload>
        </Form.Item>

        <Form.Item
          label="Mô Tả"
          rules={[
            {
              required: true,
              message: "Please input your task name!",
            },
          ]}
        >
          <TextArea rows={4} ref={descriptionRef} />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          onClick={handleOnClickForAddProduct}
        >
          Chỉnh Sửa
        </Button>
        <Button type="" htmlType="submit">
          Hủy
        </Button>
      </Form>
    </>
  );
};
export default () => <FormDisabledDemo />;
