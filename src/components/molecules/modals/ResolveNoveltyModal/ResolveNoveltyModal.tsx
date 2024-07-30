import React, { useEffect, useState } from "react";
import { Modal, Button, Checkbox, Flex } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import "./resolvenoveltymodal.scss";
import { DocumentButton } from "@/components/atoms/DocumentButton/DocumentButton";
import { CaretRight } from "phosphor-react";
import { IIncidentDetail } from "@/hooks/useNoveltyDetail";
import { SelectNoveltyNode } from "../SelectNoveltyNote/SelectNoveltyNode";
import { MessageInstance } from "antd/es/message/interface";
import { ApplyNoveltyModal } from "../ApplyNoveltyModal/ApplyNoveltyModal";
import { ISelectedAccountingAdjustment } from "../ModalActionDiscountCredit/ModalActionDiscountCredit";

interface ResolveNoveltyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResolve: (data: { file?: File; comment: string; isAccountingAdjustment: boolean }) => void;
  isResolving: boolean;
  novelty: IIncidentDetail;
  messageApi: MessageInstance;
}

interface infoObject {
  file: File;
  fileList: File[];
}

const ResolveNoveltyModal: React.FC<ResolveNoveltyModalProps> = ({
  isOpen,
  onClose,
  onResolve,
  isResolving,
  novelty,
  messageApi
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [comment, setComment] = useState("");
  const [isAccountingAdjustment, setIsAccountingAdjustment] = useState(false);
  const [currentView, setCurrentView] = useState<string>("info");
  const [adjustmentType, setAdjustmentType] = useState<string>("");
  const [selectedNotes, setSelectedNotes] = useState<any[]>([]);

  const handleFileChange: any = (info: infoObject) => {
    const { file: rawFile } = info;
    if (rawFile) {
      const fileSizeInMB = rawFile.size / (1024 * 1024);
      if (fileSizeInMB > 30) {
        return;
      }
      setFile(rawFile);
    }
  };
  const handleFileDelete = () => {
    setFile(null);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleResolve = () => {
    if (isAccountingAdjustment) {
      setCurrentView("selectAdjust");
    } else {
      onResolve({
        file: file || undefined,
        comment,
        isAccountingAdjustment
      });
      onClose();
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setComment("");
      setIsAccountingAdjustment(false);
    }
  }, [isOpen]);

  useEffect(() => {
    console.log("file", file);
  }, [file]);

  const handleAdjustmentTypeSelect = (type: string) => {
    setAdjustmentType(type);
    setCurrentView("selectNote");
  };

  const handleNoteSelection = () => {
    onClose();
  };

  const getModalHeader = () => {
    const goBack = () => {
      switch (currentView) {
        case "selectAdjust":
          setCurrentView("info");
          break;
        case "selectNote":
          setCurrentView("selectAdjust");
          break;
        case "apply":
          setCurrentView("selectNote");
          break;
        default:
          onClose();
      }
    };

    let title = isResolving ? "Resolver novedad" : "Rechazar novedad";
    switch (currentView) {
      case "selectAdjust":
        title = "Ajuste contable";
        break;
      case "selectNote":
        title = titleApplyMap[Number(adjustmentType)];
        break;
      case "apply":
        title = "Aplicar ajuste";
        break;
    }

    return (
      <div className="modal-header">
        <Button icon={<LeftOutlined />} type="text" onClick={goBack} />
        <span>{title}</span>
      </div>
    );
  };
  useEffect(() => {
    if (currentView === "selectAdjust") {
      setSelectedNotes([]);
    }
  }, [currentView]);

  return (
    <Modal
      title={getModalHeader()}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={"40%"}
      bodyStyle={{
        height: currentView === "selectNote" ? "calc(80vh - 20px)" : "auto"
      }}
      className="resolve-novelty-modal"
    >
      {currentView === "info" && (
        <div className="content">
          <p>Si deseas, adjunta un documento y/o ingresa un comentario</p>
          <div className="upload-section">
            <Flex vertical>
              <label>Documento</label>
              <small>*Opcional</small>
            </Flex>
            <DocumentButton
              title="Adjunto"
              fileName={file ? file.name : "Seleccionar archivo"}
              fileSize={file ? file.size : "PDF, Word, PNG (Tamaño max 30mb)"}
              handleOnChange={handleFileChange}
              handleOnDelete={handleFileDelete}
            />
          </div>

          <div className="comment-section">
            <Flex vertical>
              <label>Comentarios</label>
              <small>*Opcional</small>
            </Flex>
            <textarea
              placeholder="Ingresar comentario"
              value={comment}
              onChange={handleCommentChange}
            />
          </div>
          {isResolving && (
            <Checkbox
              checked={isAccountingAdjustment}
              onChange={(e) => setIsAccountingAdjustment(e.target.checked)}
            >
              Marca esta casilla si esta novedad generó un ajuste contable
            </Checkbox>
          )}
          <div className="footer">
            <Button onClick={onClose}>Cancelar</Button>
            <Button type="primary" onClick={handleResolve}>
              {isResolving ? "Resolver" : "Rechazar"}
            </Button>
          </div>
        </div>
      )}
      {currentView === "selectAdjust" && (
        <div className="content">
          <p>Selecciona el tipo de ajuste contable a aplicar</p>
          <Flex vertical gap="small">
            <button className="actionButton" onClick={() => handleAdjustmentTypeSelect("2")}>
              <p className="actionButton__text">Nota crédito</p>
              <CaretRight className="actionButton__caretRight" />
            </button>
            <button className="actionButton" onClick={() => handleAdjustmentTypeSelect("1")}>
              <p className="actionButton__text">Nota débito</p>
              <CaretRight className="actionButton__caretRight" />
            </button>
            <button className="actionButton" onClick={() => handleAdjustmentTypeSelect("3")}>
              <p className="actionButton__text">Descuento</p>
              <CaretRight className="actionButton__caretRight" />
            </button>
          </Flex>
        </div>
      )}
      {currentView === "selectNote" && (
        <SelectNoveltyNode
          type={Number(adjustmentType)}
          selectedNotes={selectedNotes}
          setSelectedNotes={setSelectedNotes}
          onClose={() => setCurrentView("selectAdjust")}
          onContinue={() => setCurrentView("apply")}
          clientId={"811041214"} // TODO CAMBIAR ESTO
          projectId={"81"} // TODO CAMBIAR ESTO
        />
      )}
      {currentView === "apply" && (
        <ApplyNoveltyModal
          type={Number(adjustmentType)}
          selectedRows={selectedNotes}
          setSelectedRows={setSelectedNotes}
          setCurrentView={setCurrentView}
          invoiceSelected={[novelty]}
          messageApi={messageApi}
          onClosePrincipalModal={onClose}
        />
      )}
    </Modal>
  );
};
const titleApplyMap: Record<number, string> = {
  1: "Selecionar nota débito",
  2: "Selecionar nota crédito",
  3: "Selecionar descuento"
};

export default ResolveNoveltyModal;
