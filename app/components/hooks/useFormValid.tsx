import { useState, useEffect } from "react";
import { isAllValid, useEditableForm } from "~/store/store-form";

export const useFormValid = () => {
  const [isFormValid, setIsFormValid] = useState(false);
  const { ...formValues } = useEditableForm();

  useEffect(() => {
    setIsFormValid(isAllValid(formValues));
  }, [formValues]);

  return { isFormValid };
};
