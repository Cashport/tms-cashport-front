import config from "@/config";
import { DiscountRequestBody } from "@/types/accountingAdjustment/IAccountingAdjustment";
import { API, getIdToken } from "@/utils/api/api";
import axios, { AxiosResponse } from "axios";

interface RadicationData {
  invoices_id: number[];
  radication_type: string;
  accept_date: string;
  comments: string;
}

export const createAccountingAdjustment = async (
  requestBody: DiscountRequestBody
): Promise<AxiosResponse<any>> => {
  const token = await getIdToken();
  try {
    console.log("requestBody", requestBody);

    const response: AxiosResponse<any> = await API.post(
      `${config.API_HOST}/financial-discount/project/${requestBody.project_id}/client/${requestBody.client_id}`,
      requestBody,
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    return error as any;
  }
};
export const applyAccountingAdjustment = async (
  adjustmentData: string,
  docFiles: File[] | null,
  projectId: string,
  clientId: string
): Promise<AxiosResponse<any>> => {
  const token = await getIdToken();

  const modelData = {
    adjustment_data: adjustmentData,
    doc: docFiles
  };
  console.log("modelData", modelData);

  const formData = new FormData();
  formData.append("adjustment_data", adjustmentData);
  console.log("docFiles", docFiles);
  if (docFiles) {
    docFiles.forEach((file) => {
      formData.append("doc", file);
    });
  }

  const response: AxiosResponse<any> = await axios.post(
    `${config.API_HOST}/invoice/adjusment/project/${projectId}/client/${clientId}`,
    formData,
    {
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};

export const changeStatusInvoice = async (
  statusName: string,
  invoiceIds: number[],
  comments: string,
  docFiles: File[] | null,
  projectId: number,
  clientId: number
): Promise<AxiosResponse<any>> => {
  const token = await getIdToken();
  const formData = new FormData();
  formData.append("status_name", statusName);
  formData.append("invoice_ids", JSON.stringify(invoiceIds));
  formData.append("comments", comments);
  if (docFiles) {
    docFiles.forEach((file) => {
      formData.append("files", file);
    });
  }

  const response: AxiosResponse<any> = await axios.post(
    `${config.API_HOST}/invoice/project/${projectId}/client/${clientId}/update_status`,
    formData,
    {
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};

export const radicateInvoice = async (
  radicationData: RadicationData,
  files: File[],
  clientId: number
): Promise<AxiosResponse<any>> => {
  const token = await getIdToken();

  const formData = new FormData();
  formData.append("invoices_id", JSON.stringify(radicationData.invoices_id));
  formData.append("radication_type", radicationData.radication_type);
  formData.append("accept_date", radicationData.accept_date);
  formData.append("comments", radicationData.comments);

  files.forEach((file) => {
    formData.append("files", file);
  });

  const response: AxiosResponse<any> = await axios.post(
    `${config.API_HOST}/invoice/radication/client/${clientId}`,
    formData,
    {
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};
