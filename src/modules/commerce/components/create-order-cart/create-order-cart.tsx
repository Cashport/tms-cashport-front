import { FC, useContext, useEffect, useState } from "react";
import { Flex } from "antd";
import { ISelectType } from "@/types/clients/IClients";
import { OrderViewContext } from "../../containers/create-order/create-order";
import CreateOrderItem from "../create-order-cart-item";
import { BagSimple } from "phosphor-react";
import PrincipalButton from "@/components/atoms/buttons/principalButton/PrincipalButton";
import CreateOrderDiscountsModal from "../create-order-discounts-modal";

import styles from "./create-order-cart.module.scss";
import { useAppStore } from "@/lib/store/store";
import { confirmOrder } from "@/services/commerce/commerce";
import { IOrderConfirmedResponse } from "@/types/commerce/ICommerce";
import { GenericResponse } from "@/types/global/IGlobal";
import { formatMoney } from "@/utils/utils";
export interface selectClientForm {
  client: ISelectType;
}

const CreateOrderCart: FC = ({}) => {
  const { ID: projectId } = useAppStore((state) => state.selectedProject);
  const [openDiscountsModal, setOpenDiscountsModal] = useState(false);
  const {
    selectedCategories,
    checkingOut,
    setCheckingOut,
    client,
    confirmOrderData,
    setConfirmOrderData,
    discountId
  } = useContext(OrderViewContext);

  const numberOfSelectedProducts = selectedCategories.reduce(
    (acc, category) => acc + category.products.length,
    0
  );

  const handleOpenDiscountsModal = () => {
    setOpenDiscountsModal(true);
  };

  const handleContinuePurchase = () => {
    setCheckingOut(true);
  };

  useEffect(() => {
    const fetchTotalValues = async () => {
      if (selectedCategories.length > 0) {
        const products = selectedCategories
          .flatMap((category) => category.products)
          .map((product) => ({
            product_sku: product.SKU,
            quantity: product.quantity
          }));
        const confirmOrderData = {
          discount_id: discountId,
          order_summary: products
        };
        const response = (await confirmOrder(
          projectId,
          client.id,
          confirmOrderData
        )) as GenericResponse<IOrderConfirmedResponse>;
        if (response.status === 200) {
          setConfirmOrderData(response.data);
        }
      }
    };

    const timeOut = setTimeout(() => {
      fetchTotalValues();
    }, 500);
    return () => {
      clearTimeout(timeOut);
    };
  }, [selectedCategories, discountId]);

  return (
    <div className={styles.cartContainer}>
      <div className={styles.cartContainer__top}>
        <Flex className={styles.header} justify="space-between">
          <h3>Resumen de la orden</h3>
          <p>SKUs: {numberOfSelectedProducts}</p>
        </Flex>

        {selectedCategories.length === 0 && (
          <div className={styles.emptyCart}>
            <BagSimple className={styles.bagLogo} size={82} />
            <p>Aún no has agregado productos</p>
            <button
              className={styles.discountsButton}
              data-info="Ver todos los descuentos"
              onClick={handleOpenDiscountsModal}
            ></button>
          </div>
        )}
        <div className={styles.products}>
          {selectedCategories.map((category) => (
            <div key={category.category_id}>
              <Flex className={styles.products__header} justify="space-between">
                <p>{category.category}</p>
                <p>SKUs: {category.products.length}</p>
              </Flex>
              {category.products.map((product) => (
                <CreateOrderItem
                  key={product.id}
                  product={product}
                  categoryName={category.category}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {selectedCategories.length > 0 && (
        <div className={styles.cartContainer__footer}>
          {!checkingOut && (
            <>
              <button
                className={styles.discountsButton}
                data-info="Ver todos los descuentos"
                onClick={handleOpenDiscountsModal}
              ></button>
              <hr className={styles.separator} />
            </>
          )}

          <Flex vertical gap={"0.25rem"}>
            <Flex justify="space-between">
              <p>Subtotal</p>
              <p>{formatMoney(confirmOrderData?.subtotal)}</p>
            </Flex>
            <Flex justify="space-between">
              <p>IVA 19%</p>
              <p>{formatMoney(confirmOrderData?.taxes)}</p>
            </Flex>
            <Flex justify="space-between">
              <p>Descuentos</p>
              <p>-{formatMoney(confirmOrderData.discounts)}</p>
            </Flex>
            <Flex justify="space-between">
              <strong>Total</strong>
              <strong>{formatMoney(confirmOrderData?.total)}</strong>
            </Flex>
            <Flex justify="space-between">
              <p>Total con pronto pago</p>
              <p>{formatMoney(confirmOrderData?.total_pronto_pago)}</p>
            </Flex>
          </Flex>

          {!checkingOut && (
            <PrincipalButton onClick={handleContinuePurchase}>Continuar compra</PrincipalButton>
          )}
        </div>
      )}

      {openDiscountsModal && (
        <CreateOrderDiscountsModal setOpenDiscountsModal={setOpenDiscountsModal} />
      )}
    </div>
  );
};

export default CreateOrderCart;
