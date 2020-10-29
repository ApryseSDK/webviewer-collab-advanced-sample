import { useHistory } from 'react-router-dom';
import { useCallback } from 'react';

type SetDocumentParam = {
  documentId: string,
  annotationId?: string;
}

export default () => {

  const history = useHistory();

  const setViewPath = useCallback(({
    documentId,
    annotationId,
  }: SetDocumentParam) => {

    let path = `/view/${documentId}`;
    if (annotationId) {
      path += `/${annotationId}`
    }

    history.push(path);
  }, [history])

  return {
    setViewPath,
    history
  }

}