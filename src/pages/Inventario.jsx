import PageContainer from "../components/ui/PageContainer";
import PageTitle from "../components/ui/PageTitle";
import Section from "../components/ui/Section";
import TableContainer from "../components/ui/TableContainer";

const Inventario = () => {
  return (
    <PageContainer>
      <PageTitle title="Inventario" subtitle="Gestión de productos"/>
      <Section title="Lista de prroductos">
        <TableContainer></TableContainer>
      </Section>
    </PageContainer>
  );
}

export default Inventario