import "./ProviderActions.css";

import Button from "../../ui/Button/Button";

const ProviderActions = ({
  accion,
  setAccion,
  resetForm
}) => {

  const actions = [

    {
      name: "Agregar",
      value: "agregar",
      variant: "primary"
    },

    {
      name: "Actualizar",
      value: "actualizar",
      variant: "primary"
    },

    {
      name: "Borrar",
      value: "borrar",
      variant: "primary"
    }
  ];

  return (
    <>
      <div className="provider-actions">

        {actions.map((item) => (

          <Button
            key={item.value}

            variant={
              accion === item.value
                ? item.variant
                : "secondary"
            }

            onClick={() => {

              if (item.value === "agregar") {
                resetForm();
              }

              setAccion(item.value);
            }}
          >
            {item.name}
          </Button>

        ))}

      </div>
    </>

  );
};

export default ProviderActions



