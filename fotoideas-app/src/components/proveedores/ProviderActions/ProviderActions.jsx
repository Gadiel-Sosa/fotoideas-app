import { useState } from "react";

import Button from "../../ui/Button/Button";

import ProviderAddForm from "../ProviderAddForm/ProviderAddForm";
import ProviderUpdateForm from "../ProviderUpdateForm/ProviderUpdateForm";
import ProviderDeleteForm from "../ProviderDeleteForm/ProviderDeleteForm";

import "./ProviderActions.css";

const ProviderActions = () => {

  const [tab, setTab] = useState("agregar");

  const tabs = [
    {
      name: "Agregar",
      value: "agregar"
    },
    {
      name: "Actualizar",
      value: "actualizar"
    },
    {
      name: "Borrar",
      value: "borrar"
    }
  ];

  return (
    <>
      <div className="provider-actions">

        {tabs.map((item) => (

          <Button
            key={item.value}
            variant={tab === item.value ? "primary" : "secondary"}
            onClick={() => setTab(item.value)}
          >
            {item.name}
          </Button>

        ))}

      </div>

      {tab === "agregar" && <ProviderAddForm />}

      {tab === "actualizar" && <ProviderUpdateForm />}

      {tab === "borrar" && <ProviderDeleteForm />}
    </>
  );
};

export default ProviderActions