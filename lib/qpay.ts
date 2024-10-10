import { Qpay } from "mn-payment";

const qpay = new Qpay(
  process.env.QPAY_USERNAME ?? "",
  process.env.QPAY_PASSWORD ?? "",
  process.env.QPAY_INVOICE_CODE ?? "",
);

export default qpay;
