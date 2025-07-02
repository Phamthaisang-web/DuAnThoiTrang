"use client";

import React, { useState } from "react";
import { Layout, Menu, Breadcrumb, Space, theme } from "antd";
import {
  FileOutlined,
  PieChartOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  FolderOutlined,
  StarOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router";
import UserInfo from "../components/UserInfo";

const { Header, Content, Sider } = Layout;

interface CustomMenuItem {
  key: React.Key;
  label: React.ReactNode;
  icon?: React.ReactNode;
  children?: CustomMenuItem[];
}

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: CustomMenuItem[]
): CustomMenuItem {
  return { key, icon, children, label };
}

const items: CustomMenuItem[] = [
  getItem("Dashboard", "", <PieChartOutlined />),
  getItem("User", "users", <UserOutlined />),
  getItem("Brand", "brands", <StarOutlined />),
  getItem("Category", "categories", <FolderOutlined />),
  getItem("Products", "products", <AppstoreOutlined />),
  getItem("Orders", "orders", <ShoppingCartOutlined />),
];

const getBreadcrumbItems = (pathname: string) => {
  if (pathname === "/") return [{ title: "Dashboard" }];

  const paths = pathname.split("/").filter(Boolean);
  return [
    { title: "Dashboard", href: "/" },
    ...paths.map((path, index) => {
      const url = `/${paths.slice(0, index + 1).join("/")}`;
      const title =
        path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");
      return { title, href: url };
    }),
  ];
};

const DefaultLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const selectedKey = location.pathname.split("/")[1] || "";

  return (
    <Layout className="min-h-screen">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="dark"
      >
        <div className="h-16 flex items-center justify-center">
          <h1 className="text-white text-xl font-bold m-0 p-4 truncate">
            {collapsed ? "Admin" : "Admin Dashboard"}
          </h1>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[selectedKey]}
          items={items}
          onClick={({ key }) => navigate(`/${key}`)}
        />
      </Sider>

      <Layout>
        <Header
          className="flex items-center justify-between p-0 px-6 text-white shadow-lg"
          style={{
            background:
              "linear-gradient(to right,rgb(44, 113, 233),rgb(68, 116, 220))",
          }}
        >
          <div className="flex items-center">
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "text-lg cursor-pointer mr-4",
                onClick: () => setCollapsed(!collapsed),
              }
            )}
          </div>
          <Space>
            <UserInfo />
          </Space>
        </Header>

        <Content className="p-0">
          <div className="container mx-auto px-4 mt-6">
            <Breadcrumb
              items={getBreadcrumbItems(location.pathname)}
              className="mb-6"
            />
            <div
              className="bg-white rounded-lg shadow-sm p-6 mt-6"
              style={{ background: colorBgContainer }}
            >
              <Outlet />
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;
