import { useRef, useEffect } from 'react'

function useDocumentTitle(title: string, prevailOnUnmount = false) {
  const defaultTitle = useRef(document.title);

  //will set the dynamic doc title whenever the title changes
  useEffect(() => {
    document.title = title;
  }, [title]);

// clean up function that will set the doc title on its default title when the component unmounts   
  useEffect(() => () => {
    if (!prevailOnUnmount) {
      document.title = defaultTitle.current;
    }
  }, [])
}

export default useDocumentTitle