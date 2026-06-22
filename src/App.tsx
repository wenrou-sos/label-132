import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import Home from "@/pages/Home";

const theme = {
  token: {
    colorPrimary: "#B85C38",
    colorBgContainer: "#FDFBF7",
    colorText: "#2B2118",
    colorTextSecondary: "#5C4A3A",
    colorBorder: "#E8E0D5",
    borderRadius: 8,
    fontFamily: "'DM Sans', 'Noto Sans SC', system-ui, sans-serif",
    fontSize: 13,
    controlHeight: 32,
  },
  components: {
    Button: {
      primaryShadow: "none",
      defaultShadow: "none",
    },
    DatePicker: {
      cellHoverWithRangeBg: "#B85C3815",
    },
  },
};

export default function App() {
  return (
    <ConfigProvider locale={zhCN} theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}
