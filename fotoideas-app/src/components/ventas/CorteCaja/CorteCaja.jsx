import { useState, useEffect } from "react";
import "./CorteCaja.css";
import Button from "../../ui/Button/Button";
import Input from "../../ui/Input/Input";
import Section from "../../ui/Section/Section";
import { obtenerDatosCorte, realizarCorte } from "../../../services/CorteService";

const CorteCaja = () => {
  const [loading, setLoading] = useState(true);
  const [corte, setCorte] = useState({
    id_corte: null,
    cajero: "",
    ventasTotales: 0,
    montoInicial: "",
    efectivoEsperado: 0,
    efectivoReal: "",
    diferenciaCaja: 0,
    pagoProveedores: "",
    observaciones: ""
  });

  useEffect(() => {
    cargarDatosCorte();
  }, []);

  const cargarDatosCorte = async () => {
    try {
      setLoading(true);
      const datos = await obtenerDatosCorte();

      if (datos) {
        setCorte({
          ...corte,
          id_corte: datos.id_corte,
          cajero: datos.cajero,
          ventasTotales: datos.ventasTotales,
          montoInicial: datos.montoInicial === 0 ? "" : datos.montoInicial,
          efectivoEsperado: datos.efectivoEsperado
        });
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
      alert("Error al cargar los datos del corte");
    } finally {
      setLoading(false);
    }
  };

  const handleMontoInicialChange = (e) => {
    const val = e.target.value;
    const numMonto = val === "" ? 0 : parseFloat(val);
    const ventas = parseFloat(corte.ventasTotales) || 0;
    const esperado = numMonto + ventas;
    const real = corte.efectivoReal === "" ? 0 : parseFloat(corte.efectivoReal);

    setCorte({
      ...corte,
      montoInicial: val,
      efectivoEsperado: esperado,
      diferenciaCaja: real - esperado
    });
  };

  const handleEfectivoRealChange = (e) => {
    const val = e.target.value;
    const real = val === "" ? 0 : parseFloat(val);
    const esperado = parseFloat(corte.efectivoEsperado) || 0;
    
    setCorte({
      ...corte,
      efectivoReal: val,
      diferenciaCaja: real - esperado
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
    
    if (corte.efectivoReal === "" || parseFloat(corte.efectivoReal) === 0) {
      alert("Debe ingresar el efectivo contado");
      return;
    }

    try {
      const resultado = await realizarCorte({
        id_corte: corte.id_corte,
        monto_inicial: parseFloat(corte.montoInicial) || 0,
        efectivo_real: parseFloat(corte.efectivoReal) || 0,
        pago_proveedores: parseFloat(corte.pagoProveedores) || 0,
        observaciones_corte: corte.observaciones
      });

      alert(`Corte realizado exitosamente\nDiferencia: $${resultado.datos.diferencia_caja.toFixed(2)}`);
      
      cargarDatosCorte();
      setCorte({
        ...corte,
        efectivoReal: "",
        diferenciaCaja: 0,
        pagoProveedores: "",
        observaciones: ""
      });
    } catch (error) {
        console.error("Error al realizar corte:", error);
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
              name="montoInicial"
              type="number"
              value={corte.montoInicial}
              onChange={handleMontoInicialChange}
              placeholder="0.00"
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