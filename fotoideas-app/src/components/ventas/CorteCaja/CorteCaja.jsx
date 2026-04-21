import { useState, useEffect } from "react";
import "./CorteCaja.css";
import Button from "../../ui/Button/Button";
import Input from "../../ui/Input/Input";
import Section from "../../ui/Section/Section";
import { obtenerDatosCorte, realizarCorte } from "../../../services/corteService";

const CorteCaja = () => {
  const [loading, setLoading] = useState(true);
  const [corte, setCorte] = useState({
    id_corte: null,
    cajero: "",
    ventasTotales: 0,
    montoInicial: 0,
    efectivoEsperado: 0,
    efectivoReal: 0,
    diferenciaCaja: 0,
    pagoProveedores: 0,
    observaciones: ""
  });

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatosCorte();
  }, []);

  const cargarDatosCorte = async () => {
    try {
      setLoading(true);
      const datos = await obtenerDatosCorte();
      setCorte({
        ...corte,
        id_corte: datos.id_corte,
        cajero: datos.cajero,
        ventasTotales: datos.ventasTotales,
        montoInicial: datos.montoInicial,
        efectivoEsperado: datos.efectivoEsperado
      });
    } catch (error) {
      console.error("Error al cargar datos:", error);
      alert("Error al cargar los datos del corte");
    } finally {
      setLoading(false);
    }
  };

  const handleEfectivoRealChange = (e) => {
    const efectivoReal = parseFloat(e.target.value) || 0;
    const diferencia = efectivoReal - corte.efectivoEsperado;
    
    setCorte({
      ...corte,
      efectivoReal: efectivoReal,
      diferenciaCaja: diferencia
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCorte({
      ...corte,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (corte.efectivoReal === 0) {
      alert("Debe ingresar el efectivo contado");
      return;
    }

    try {
      const resultado = await realizarCorte({
        id_corte: corte.id_corte,
        efectivo_real: corte.efectivoReal,
        pago_proveedores: corte.pagoProveedores,
        observaciones_corte: corte.observaciones
      });

      alert(`Corte realizado exitosamente\nDiferencia: $${resultado.datos.diferencia_caja.toFixed(2)}`);
      
      // Recargar datos o resetear formulario
      cargarDatosCorte();
      setCorte({
        ...corte,
        efectivoReal: 0,
        diferenciaCaja: 0,
        pagoProveedores: 0,
        observaciones: ""
      });
    } catch (error) {
        console.error("Error al cargar datos:", error);
      alert("Error al realizar el corte");
    }
  };

  if (loading) {
    return <div className="corte-loading">Cargando datos del corte...</div>;
  }

  return (
    <Section>
      <form onSubmit={handleSubmit}>
        <div className="corte-grid">
          {/* Columna izquierda - Campos automáticos (solo lectura) */}
          <div className="corte-col">
            <Input
              label="Folio"
              value={corte.id_corte || "Sin corte activo"}
              readOnly
            />
            <Input
              label="Ventas del turno"
              type="number"
              value={corte.ventasTotales.toFixed(2)}
              readOnly
            />
            <Input
              label="Cajero"
              value={corte.cajero}
              readOnly
            />
            <Input
              label="Efectivo del sistema"
              type="number"
              value={corte.efectivoEsperado.toFixed(2)}
              readOnly
            />
          </div>

          {/* Columna derecha - Campos automáticos y editables */}
          <div className="corte-col">
            <Input
              label="Fondo de caja"
              type="number"
              value={corte.montoInicial.toFixed(2)}
              readOnly
            />
            <Input
              label="Diferencias en caja"
              type="text"
              value={`$${corte.diferenciaCaja.toFixed(2)}`}
              readOnly
              className={corte.diferenciaCaja >= 0 ? "positive" : "negative"}
            />
            <Input
              label="Efectivo contado"
              name="efectivoReal"
              type="number"
              value={corte.efectivoReal}
              onChange={handleEfectivoRealChange}
              placeholder="Ingrese el efectivo contado"
              required
            />
            <Input
              label="Pagos a proveedores"
              name="pagoProveedores"
              type="number"
              value={corte.pagoProveedores}
              onChange={handleInputChange}
              placeholder="0"
            />
          </div>
        </div>

        <div className="corte-full">
          <Input
            label="Notas/Aclaraciones"
            name="observaciones"
            value={corte.observaciones}
            onChange={handleInputChange}
            placeholder="Observaciones del corte..."
          />
        </div>

        <div className="corte-buttons">
          <Button variant="secondary" type="button" onClick={cargarDatosCorte}>
            Actualizar
          </Button>
          <Button variant="primary" type="submit">
            Realizar Corte
          </Button>
        </div>
      </form>
    </Section>
  );
};

export default CorteCaja;