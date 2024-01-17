import { numberToVND } from "../utils/common";
import {
  Row,
  Col,
  Card,
  // Radio,
  Table,
  // Upload,
  // message,
  // Progress,
  Button,
  // Avatar,
  Typography,
  Image,
  Dropdown,
  Space,
  List,
  Flex,
} from "antd";
import { ProductContext } from "../store/product-context";
import React, { useCallback, useContext, useEffect } from "react";

import { DownOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title } = Typography;

// const formProps = {
//   name: "file",
//   action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
//   headers: {
//     authorization: "authorization-text",
//   },
//   onChange(info) {
//     if (info.file.status !== "uploading") {
//       console.log(info.file, info.fileList);
//     }
//     if (info.file.status === "done") {
//       message.success(`${info.file.name} file uploaded successfully`);
//     } else if (info.file.status === "error") {
//       message.error(`${info.file.name} file upload failed.`);
//     }
//   },
// };
// table code start
const columns = [
  {
    title: "TÊN SẢN PHẨM",
    dataIndex: "name",
    key: "name",
    width: "40%",
    fixed: "left",
  },
  {
    title: "HÃNG",
    dataIndex: "brand",
    key: "brand",
  },

  {
    title: "GIẢM GIÁ (MARKETING)",
    key: "discountPercentage",
    dataIndex: "discountPercentage",
  },

  {
    title: "GIÁ MUỐN BÁN",
    key: "originalPrice",
    dataIndex: "originalPrice",
  },

  {
    title: "HÌNH ẢNH",
    key: "thumbnail",
    dataIndex: "thumbnail",
  },
  {
    title: "MÔ TẢ",
    key: "description",
    dataIndex: "description",
  },
  {
    title: "CHỈNH SỬA",
    key: "edit",
    dataIndex: "edit",
    fixed: "right",
    // width: 100,
    // render: () => <a>action</a>,
  },
];

/*{
        id: 1,
        brand: "Giant",
        discountPercentage: 30,
        title: "XE ĐẠP ĐỊA HÌNH GIANT ROAM 3 DISC",
        thumbnail:
          "https://xedaphn.net/wp-content/uploads/2022/04/Roam-3-Disc-2023.jpg",
        price: 12900000,
        description:
          "Giant Roam 3 Disc Nhôm 29 inch Gamet có ngôn ngữ thiết kế mạnh mẽ, hiện đại với nhiều  màu sắc cho bạn lựa chọn. Đây sẽ là sự lựa chọn tuyệt vời dành cho những người yêu thích đạp xe để rèn luyện thể chất hay cùng bạn bè trải nghiệm ở những cung đường khó.",
      },*/

// project table start
// const project = [
//   {
//     title: "COMPANIES",
//     dataIndex: "name",
//     width: "32%",
//   },
//   {
//     title: "BUDGET",
//     dataIndex: "age",
//   },
//   {
//     title: "STATUS",
//     dataIndex: "address",
//   },
//   {
//     title: "COMPLETION",
//     dataIndex: "completion",
//   },
// ];

// /**/
// const dataproject = [
//   {
//     key: "1",

//     name: (
//       <>
//         <Avatar.Group>
//           <Avatar className="shape-avatar" src={ava1} size={25} alt="" />
//           <div className="avatar-info">
//             <Title level={5}>Spotify Version</Title>
//           </div>
//         </Avatar.Group>
//       </>
//     ),
//     age: (
//       <>
//         <div className="semibold">$14,000</div>
//       </>
//     ),
//     address: (
//       <>
//         <div className="text-sm">working</div>
//       </>
//     ),
//     completion: (
//       <>
//         <div className="ant-progress-project">
//           <Progress percent={30} size="small" />
//           <span>
//             <Link to="/">
//               <img src={pencil} alt="" />
//             </Link>
//           </span>
//         </div>
//       </>
//     ),
//   },
// ];

const Tables = () => {
  const [currentData, setCurrentData] = React.useState([]);
  const [selectedType, setSelectedType] = React.useState({
    label: "All",
    key: "all",
  });
  // const onChange = (e) => console.log(`radio checked:${e.target.value}`);
  const { products, removeProduct } = useContext(ProductContext);

  useEffect(() => {
    if (selectedType.key === "all") {
      setCurrentData(
        products
          .map((subObj) => {
            if (subObj.products) {
              return subObj.products;
            }
            return [];
          })
          .reduce((acc, cur) => acc.concat(cur), [])
      );
    } else {
      const currentData = products.find(
        (item) => item.key === selectedType.key
      );

      setCurrentData(currentData?.products ? currentData.products : []);
    }
  }, [selectedType.key, products]);

  useEffect(() => {
    console.log(products);
  }, [products]);

  const data = currentData.map((product) => {
    return {
      key: product.id,
      name: (
        <>
          <Title level={5}>{product.title}</Title>
        </>
      ),
      brand: (
        <>
          <div className="ant-brand">
            <span>{product.brand}</span>
          </div>
        </>
      ),
      thumbnail: (
        <div style={{ width: "100%" }}>
          <Flex style={{ flexDirection: "column" }} gap="0.5rem">
            {product.thumbnail.map((item, index) => {
              return (
                <Image
                  key={index}
                  src={item}
                  style={{ borderRadius: "10px", width: "100%" }}
                />
              );
            })}
          </Flex>
        </div>
      ),
      discountPercentage: <span>{product.discountPercentage}</span>,
      originalPrice: <span>{numberToVND(product.price)}</span>,
      description: <div className="ant-description">{product.description}</div>,
      edit: (
        <>
          <Button>
            <Link
              to={{
                pathname: `/edit/${product.id}`,
                state: {
                  ...product,
                  key: products.find((item) => {
                    return item.products.some(
                      (productItem) => productItem.id === product.id
                    );
                  }).key,
                },
              }}
            >
              Chỉnh sửa
            </Link>
          </Button>
          <Button
            onClick={() => {
              removeProduct(product.id);
              // console.log(product.id);
            }}
          >
            Xóa
          </Button>
        </>
      ),
    };
  });

  const items = [
    {
      label: "All",
      key: "all",
    },
    {
      label: "Xe đạp",
      key: "bicycle",
    },
    {
      label: "Xe điện",
      key: "eBike",
    },
    {
      label: "Xe máy điện",
      key: "eMotobike",
    },
    {
      label: "Phụ kiện",
      key: "fitting",
    },
  ];

  const handleMenuClick = useCallback((e) => {
    console.log(e);
    const selected = items.find((item) => item.key === e.key);
    setSelectedType(selected);
  });

  const menuProps = {
    onClick: handleMenuClick,
    items,
  };

  return (
    <>
      <div className="tabled">
        <Row gutter={[24, 0]}>
          <Col xs="24" xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="Bảng sản phẩm"
              extra={
                <>
                  <Dropdown menu={menuProps}>
                    <Button>
                      <Space>
                        {selectedType.label} <DownOutlined />
                      </Space>
                    </Button>
                  </Dropdown>
                </>
              }
            >
              <div className="table-responsive">
                <Table
                  bordered={true}
                  columns={columns}
                  dataSource={data}
                  className="ant-border-space"
                />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Tables;
