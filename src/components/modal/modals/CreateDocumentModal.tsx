import {
    DocumentType,
    FILE,
    RenameNodeModal,
    UiDriveNode,
    UiFolderNode,
    UiNode,
} from '@powerhousedao/design-system';
import { DocumentModel } from 'document-model/document';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDocumentDriveServer } from 'src/hooks/useDocumentDriveServer';

export interface CreateDocumentModalProps {
    open: boolean;
    selectedParentNode: UiDriveNode | UiFolderNode | null;
    setSelectedNode: (uiNode: UiNode | null) => void;
    documentModel: DocumentModel;
    onClose: () => void;
}

export const CreateDocumentModal: React.FC<
    CreateDocumentModalProps
> = props => {
    const {
        open,
        onClose,
        selectedParentNode,
        setSelectedNode,
        documentModel,
    } = props;

    const { t } = useTranslation();
    const { addDocument } = useDocumentDriveServer();

    const onCreateDocument = async (documentName: string) => {
        onClose();

        if (!selectedParentNode) {
            throw new Error('No drive or folder selected');
        }

        const node = await addDocument(
            selectedParentNode.driveId,
            documentName || `New ${documentModel.documentModel.name}`,
            documentModel.documentModel.id,
            selectedParentNode.id,
        );

        if (node) {
            setSelectedNode({
                ...node,
                kind: FILE,
                documentType: node.documentType as DocumentType,
                parentFolder: selectedParentNode.id,
                driveId: selectedParentNode.driveId,
                syncStatus: selectedParentNode.syncStatus,
                synchronizationUnits: [],
            });
        }
    };

    return (
        <RenameNodeModal
            open={open}
            header={t('modals.createDocument.header')}
            placeholder={t('modals.createDocument.placeholder')}
            cancelLabel={t('common.cancel')}
            continueLabel={t('common.create')}
            onContinue={onCreateDocument}
            onOpenChange={status => {
                if (!status) return onClose();
            }}
        />
    );
};
